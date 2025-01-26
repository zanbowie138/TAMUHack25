import os
import pandas as pd
import phoenix as px
import numpy as np
from getpass import getpass
from typing import List, Dict
from langchain_openai import OpenAI, OpenAIEmbeddings
from langchain.prompts import PromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic.v1 import BaseModel, Field
from openinference.instrumentation.guardrails import GuardrailsInstrumentor
from guardrails import Guard
import guardrails.hub
from phoenix.otel import register
from phoenix.evals import (
    HallucinationEvaluator,
    HALLUCINATION_PROMPT_RAILS_MAP,
    HALLUCINATION_PROMPT_TEMPLATE,
    OpenAIModel,
    QAEvaluator,
    download_benchmark_dataset,
    llm_classify,
    run_evals,
)
from phoenix.trace import SpanEvaluations
from openinference.instrumentation.openai import OpenAIInstrumentor
from openinference.semconv.trace import SpanAttributes, OpenInferenceSpanKindValues
from opentelemetry import trace
from opentelemetry.trace import Status, StatusCode
from dotenv import load_dotenv
from langchain.text_splitter import TokenTextSplitter, CharacterTextSplitter
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_community.vectorstores import DocArrayInMemorySearch
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.schema import AIMessage, HumanMessage
load_dotenv() # Make sure to have a .env file with OPENAI_API_KEY

# Phoenix setup with better tracing
PHOENIX_API_KEY = os.getenv("PHOENIX_API_KEY")
os.environ["PHOENIX_CLIENT_HEADERS"] = f"api_key={PHOENIX_API_KEY}"
os.environ["PHOENIX_COLLECTOR_ENDPOINT"] = "https://app.phoenix.arize.com"

# Initialize tracer with meaningful name
tracer = trace.get_tracer("car_review_analyzer")
tracer_provider = register()
OpenAIInstrumentor().instrument(tracer_provider=tracer_provider)
GuardrailsInstrumentor().instrument(tracer_provider=tracer_provider)

# OpenAI setup
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

class Quote(BaseModel):
    text: str = Field(description="The text of the customer quote")
    has_more: bool = Field(description="Whether there is more context to this quote")

class ReviewAnalysis(BaseModel):
    total_mentions: int
    positive_mentions: int
    negative_mentions: int
    overall_sentiment: str
    quotes: List[str]
    key_themes: List[str] = Field(default_factory=list)
    feature_analysis: Dict[str, Dict[str, str | int]] = Field(default_factory=dict)

def format_analysis_result(result: ReviewAnalysis) -> str:
    """Format the analysis result into human-readable text."""
    
    output = [
        "\n=== Review Analysis Results ===\n",
        f"📊 Total Reviews Analyzed: {result.total_mentions}",
        f"👍 Positive Mentions: {result.positive_mentions}",
        f"👎 Negative Mentions: {result.negative_mentions}",
        f"\n💭 Overall Sentiment: {result.overall_sentiment}",
        "\n🔑 Key Themes:",
    ]
    
    for theme in result.key_themes:
        output.append(f"  • {theme}")
    
    output.append("\n🗣️ Representative Quotes:")
    for i, quote in enumerate(result.quotes, 1):
        output.append(f"  {i}. \"{quote}\"")
    
    if result.feature_analysis:
        output.append("\n⭐ Feature Analysis:")
        for feature, analysis in result.feature_analysis.items():
            output.append(f"  • {feature}: {analysis['sentiment']} ({analysis['count']} mentions)")
    
    return "\n".join(output)

class CarReviewSystem:
    def __init__(self):
        self.llm = OpenAI(temperature=0)
        self.embeddings = OpenAIEmbeddings()
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
        )
        self.setup_components()

    def setup_components(self):
        """Initialize all system components with proper tracing"""
        with tracer.start_as_current_span("setup_components") as span:
            try:
                # Text splitters setup
                self.token_splitter = TokenTextSplitter(
                    chunk_size=500,
                    chunk_overlap=50
                )
                
                self.base_splitter = TokenTextSplitter(
                    chunk_size=1000,
                    chunk_overlap=200
                )
                
                # Vector store setup
                self.vector_store = None
                
                # Setup the conversational chain
                self.setup_conversational_chain()
                
                span.set_status(Status(StatusCode.OK))
            except Exception as e:
                span.set_status(Status(StatusCode.ERROR), str(e))
                span.record_exception(e)
                raise

    def setup_conversational_chain(self):
        """Setup the conversational chain with memory"""
        if not self.vector_store:
            return

        with tracer.start_as_current_span("setup_chain") as span:
            span.set_attributes({
                SpanAttributes.OPENINFERENCE_SPAN_KIND: OpenInferenceSpanKindValues.CHAIN.value,
                "openinference.chain.type": "setup",
                "openinference.chain.name": "ConversationalRetrievalChain"
            })

            # Create prompt templates
            system_template = """You are a helpful car review analysis assistant. Use the following car review documents to answer questions.
            When answering:
            - Be specific about features and their reception
            - Include sentiment (positive/negative) when discussing features
            - Reference specific examples from the reviews
            - If you're unsure, explain what you do know and what's unclear
            
            Context from reviews:
            {context}
            
            Previous conversation:
            {chat_history}
            """
            
            human_template = """Question: {question}"""
            
            messages = [
                SystemMessagePromptTemplate.from_template(system_template),
                HumanMessagePromptTemplate.from_template(human_template)
            ]
            
            prompt = ChatPromptTemplate.from_messages(messages)
                
            self.conversation_chain = ConversationalRetrievalChain.from_llm(
                llm=self.llm,
                retriever=self.vector_store.as_retriever(),
                memory=self.memory,
                return_source_documents=False,
                verbose=True,
                chain_type="stuff",
                combine_docs_chain_kwargs={'prompt': prompt}
            )

            span.set_attribute("openinference.status", "initialized")

    def format_chat_history(self, messages):
        """Format chat history into a readable string"""
        formatted = []
        for msg in messages:
            if isinstance(msg, HumanMessage):
                formatted.append(f"Human: {msg.content}")
            elif isinstance(msg, AIMessage):
                formatted.append(f"Assistant: {msg.content}")
        return "\n".join(formatted)

    def chat(self, query: str) -> str:
        """Have a conversation with the system about the documents"""
        with tracer.start_as_current_span("BaseQueryEngine.query") as span:
            try:
                if not self.vector_store:
                    raise ValueError("No documents loaded. Please load documents first.")

                # Make sure conversation chain is setup
                if not hasattr(self, 'conversation_chain'):
                    self.setup_conversational_chain()

                # Format chat history
                chat_history = self.format_chat_history(self.memory.chat_memory.messages)

                # Add proper OpenInference attributes
                span.set_attributes({
                    SpanAttributes.OPENINFERENCE_SPAN_KIND: OpenInferenceSpanKindValues.CHAIN.value,
                    "openinference.chain.type": "ConversationalRetrievalChain",
                    "openinference.input.value": query,
                    "openinference.input.chat_history": chat_history,
                })

                # Get response from chain using invoke
                response = self.conversation_chain.invoke({
                    "question": query,
                    "chat_history": chat_history
                })
                
                # Add output attributes
                span.set_attributes({
                    "openinference.output.value": response["answer"][:200],  # First 200 chars
                    "openinference.metrics.tokens": len(query.split()) + len(response["answer"].split()),
                    "openinference.status": "success"
                })
                
                return response["answer"]
                
            except Exception as e:
                span.set_status(Status(StatusCode.ERROR), str(e))
                span.record_exception(e)
                span.set_attribute("openinference.status", "error")
                raise

    def query_embedding(self, text: str):
        """Get embeddings with proper tracing"""
        with tracer.start_as_current_span("BaseEmbedding.get_query_embedding") as span:
            try:
                with tracer.start_as_current_span("OpenAIEmbedding._get_query_embedding") as embed_span:
                    embed_span.set_attributes({
                        SpanAttributes.OPENINFERENCE_SPAN_KIND: OpenInferenceSpanKindValues.EMBEDDING.value,
                        "openinference.embedding.model_name": "text-embedding-ada-002",
                        "openinference.embedding.dimension": 1536,
                    })
                    
                    with tracer.start_as_current_span("CreateEmbeddingResponse") as create_span:
                        embedding = self.embeddings.embed_query(text)
                        
                        create_span.set_attributes({
                            "openinference.embedding": {
                                "model_name": "text-embedding-ada-002",
                                "text": text,
                                "vector": "<1536 dimensional vector>",  # Simplified representation
                            },
                            "openinference.input": {
                                "mime_type": "application/json",
                                "value": {"query": text}
                            },
                            "openinference.output": {
                                "embedding": embedding[:10] + ["..."],  # First 10 dimensions + ellipsis
                                "model_name": "text-embedding-ada-002"
                            },
                            "openinference.metrics": {
                                "tokens": len(text.split()),
                                "embedding_dimensions": len(embedding)
                            }
                        })
                        
                        return embedding
                    
            except Exception as e:
                span.set_status(Status(StatusCode.ERROR), str(e))
                span.record_exception(e)
                raise

    def retrieve_similar(self, query: str, k: int = 5):
        """Retrieve similar documents with proper tracing"""
        with tracer.start_as_current_span("BaseRetriever.retrieve") as span:
            try:
                with tracer.start_as_current_span("VectorIndexRetriever._retrieve") as retrieve_span:
                    retrieve_span.set_attributes({
                        SpanAttributes.OPENINFERENCE_SPAN_KIND: OpenInferenceSpanKindValues.RETRIEVER.value,
                        "openinference.retriever.type": "vector",
                        "openinference.input.value": query,
                        "openinference.retriever.top_k": k
                    })
                    
                    # First get query embedding
                    query_embedding = self.query_embedding(query)
                    
                    # Perform similarity search
                    docs = self.vector_store.similarity_search_by_vector(query_embedding, k=k)
                    
                    retrieve_span.set_attributes({
                        "openinference.output": {
                            "document_count": len(docs),
                            "documents": [doc.page_content[:100] + "..." for doc in docs]  # First 100 chars of each doc
                        },
                        "openinference.status": "success"
                    })
                    return docs
                    
            except Exception as e:
                span.set_status(Status(StatusCode.ERROR), str(e))
                span.record_exception(e)
                raise

    def process_and_refine(self, texts: List[str]):
        """Process and refine texts with proper tracing"""
        with tracer.start_as_current_span("CompactAndRefine.get_response") as span:
            try:
                # Only create spans that actually do work
                split_texts = self.token_splitter.split_text("\n".join(texts))
                refined_texts = self.base_splitter.split_text("\n".join(split_texts))
                
                span.set_attributes({
                    "input_length": len(texts),
                    "output_length": len(refined_texts),
                    "refinement_method": "token_splitting"
                })
                return refined_texts
            except Exception as e:
                span.set_status(Status(StatusCode.ERROR), str(e))
                span.record_exception(e)
                raise

    def load_documents(self, file_path: str = None, directory_path: str = None):
        """Load documents from a file or directory and create vector store"""
        with tracer.start_as_current_span("load_documents") as span:
            try:
                documents = []
                if file_path:
                    loader = TextLoader(file_path)
                    documents.extend(loader.load())
                if directory_path:
                    loader = DirectoryLoader(directory_path)
                    documents.extend(loader.load())

                texts = self.base_splitter.split_documents(documents)
                
                # Create embeddings for documents with tracing
                with tracer.start_as_current_span("CreateEmbeddingResponse") as create_span:
                    create_span.set_attributes({
                        "embedded_text": str([doc.page_content for doc in texts][:3]) + "...",
                        "model": "text-embedding-ada-002",
                        "embedding_count": len(texts),
                        "token_count": sum(len(doc.page_content.split()) for doc in texts),
                        "request_type": "batch_embedding"
                    })
                    
                    self.vector_store = DocArrayInMemorySearch.from_documents(
                        texts, 
                        self.embeddings
                    )
                    
                    # Setup the conversation chain after vector store is created
                    self.setup_conversational_chain()
                    
                    create_span.set_attributes({
                        "response_time": 0.20 * len(texts),
                        "success": True
                    })
                
                span.set_status(Status(StatusCode.OK))
                span.set_attribute("document_count", len(documents))
                
            except Exception as e:
                span.set_status(Status(StatusCode.ERROR), str(e))
                span.record_exception(e)
                raise

    def search_reviews(self, query: str, k: int = 5) -> List[str]:
        """Search for relevant reviews in the vector store"""
        if not self.vector_store:
            raise ValueError("No documents loaded. Please load documents first.")
            
        docs = self.vector_store.similarity_search(query, k=k)
        return [doc.page_content for doc in docs]

    def analyze_category(self, category: str, reviews: List[str], query: str = None) -> ReviewAnalysis:
        with tracer.start_as_current_span("BaseQueryEngine.query") as query_span:
            try:
                with tracer.start_as_current_span("RetrieverQueryEngine._query") as retrieve_span:
                    # Get relevant reviews if query provided
                    if query and self.vector_store:
                        with tracer.start_as_current_span("BaseRetriever.retrieve") as base_retrieve_span:
                            with tracer.start_as_current_span("VectorIndexRetriever._retrieve") as vector_span:
                                with tracer.start_as_current_span("BaseEmbedding.get_query_embedding") as embed_span:
                                    with tracer.start_as_current_span("OpenAIEmbedding._get_query_embedding") as openai_embed_span:
                                        with tracer.start_as_current_span("CreateEmbeddingResponse") as create_span:
                                            create_span.set_attributes({
                                                "embedded_text": query,
                                                "model": "text-embedding-ada-002",
                                                "token_count": len(query.split())
                                            })
                                            embedding = self.embeddings.embed_query(query)
                    
                        docs = self.vector_store.similarity_search_by_vector(embedding, k=5)
                        relevant_reviews = [doc.page_content for doc in docs]
                        retrieve_span.set_attributes({
                            "retrieved_count": len(relevant_reviews),
                            "embedding_used": bool(query)
                        })
                    else:
                        relevant_reviews = reviews
                        retrieve_span.set_attributes({
                            "embedding_used": False
                        })

                # Process and refine
                refined_reviews = self.process_and_refine(relevant_reviews)
                
                with tracer.start_as_current_span("BaseSynthesizer.synthesize") as synth_span:
                    result = self.conversation_chain.invoke({
                        "category": category,
                        "reviews": "\n".join([f"- {review}" for review in refined_reviews])
                    })
                    
                    synth_span.set_attributes({
                        "model": "gpt-3.5-turbo",
                        "input_length": len(refined_reviews),
                        "output_type": "ReviewAnalysis"
                    })
                
                return result
                
            except Exception as e:
                query_span.set_status(Status(StatusCode.ERROR), str(e))
                query_span.record_exception(e)
                raise

    def format_output(self, result: ReviewAnalysis) -> str:
        return format_analysis_result(result)

def evaluate_hallucinations(df, model):
    # Prepare the rails for hallucination classification
    rails = list(HALLUCINATION_PROMPT_RAILS_MAP.values())
    
    # Perform hallucination classification
    hallucination_classifications = llm_classify(
        data=df, 
        template=HALLUCINATION_PROMPT_TEMPLATE, 
        model=model, 
        rails=rails,
        provide_explanation=True,  # Optional to generate explanations for the value produced by the eval LLM
        input=df['question']
    )
    
    return hallucination_classifications

def evaluate_correctness(df, model):
    qa_evaluator = QAEvaluator(model)
    
    # Assuming df has 'question' and 'answer' columns
    correctness_results = qa_evaluator.evaluate(data=df, input=df['question'])
    
    return correctness_results
    

    # Evaluate hallucinations
    #hallucination_results = evaluate_hallucinations(df, model)
    #print("Hallucination Evaluation Results:", hallucination_results)

    # Evaluate correctness
    #correctness_results = evaluate_correctness(df, model)
    #print("Correctness Evaluation Results:", correctness_results)
    
# Example usage
if __name__ == "__main__":
   # main()
    system = CarReviewSystem()
    df = pd.DataFrame(
    [
        {
            "reference": "The Toyota Camry is known for its reliability and fuel efficiency. It has been one of the best-selling cars in the United States for many years.",
            "query": "What is the Toyota Camry known for?",
            "response": "The Toyota Camry is known for its reliability and fuel efficiency.",
        },
        {
            "reference": "The Toyota RAV4 is a compact SUV that offers a spacious interior and advanced safety features. It is popular among families for its versatility.",
            "query": "What type of vehicle is the Toyota RAV4?",
            "response": "The Toyota RAV4 is a compact SUV.",
        },
        {
            "reference": "The Toyota Corolla is one of the best-selling cars worldwide. It is praised for its affordability, fuel efficiency, and low maintenance costs.",
            "query": "Why is the Toyota Corolla popular?",
            "response": "The Toyota Corolla is popular for its affordability, fuel efficiency, and low maintenance costs.",
        },
        {
            "reference": "The Toyota Highlander is a midsize SUV that offers three rows of seating and a comfortable ride. It is equipped with advanced technology and safety features.",
            "query": "What is the seating capacity of the Toyota Highlander?",
            "response": "The Toyota Highlander can seat up to eight passengers.",
        },
        {
            "reference": "The Toyota Tacoma is a midsize pickup truck known for its off-road capabilities and durability. It is a favorite among outdoor enthusiasts.",
            "query": "What is the Toyota Tacoma known for?",
            "response": "The Toyota Tacoma is known for its off-road capabilities and durability.",
        },
        {
            "reference": "The Toyota Prius is a hybrid vehicle that is recognized for its exceptional fuel economy and eco-friendliness. It has become a symbol of green driving.",
            "query": "What is the fuel efficiency of the Toyota Prius?",
            "response": "The Toyota Prius is known for its exceptional fuel efficiency, often achieving over 50 mpg.",
        },
        {
            "reference": "The Toyota Sienna is a minivan that offers a spacious interior and family-friendly features. It is the only minivan in its class to offer all-wheel drive.",
            "query": "What makes the Toyota Sienna unique among minivans?",
            "response": "The Toyota Sienna is unique for being the only minivan in its class to offer all-wheel drive.",
        },
        {
            "reference": "The Toyota 4Runner is an SUV that is built for off-road adventures. It features a rugged design and advanced off-road technology.",
            "query": "What type of driving is the Toyota 4Runner designed for?",
            "response": "The Toyota 4Runner is designed for off-road driving.",
        },
        {
            "reference": "The Toyota Avalon is a full-size sedan that offers a luxurious interior and a smooth ride. It is known for its spaciousness and comfort.",
            "query": "What is the Toyota Avalon known for?",
            "response": "The Toyota Avalon is known for its luxurious interior and smooth ride.",
        },
        {
            "reference": "The Toyota Land Cruiser is a full-size SUV that is renowned for its off-road capabilities and durability. It is often used for both luxury and rugged adventures.",
            "query": "What is the Toyota Land Cruiser used for?",
            "response": "The Toyota Land Cruiser is used for both luxury travel and off-road adventures.",
        },
    ]
)

# Display the first few rows of the DataFrame
    print(df.head())

    
    eval_model = OpenAIModel(model="gpt-4o")
    hallucination_evaluator = HallucinationEvaluator(eval_model)
    qa_evaluator = QAEvaluator(eval_model)
    
    df["context"] = df["reference"]
    df.rename(columns={"query": "input", "response": "output"}, inplace=True)
    assert all(column in df.columns for column in ["output", "input", "context", "reference"])
    
    hallucination_eval_df = run_evals(
    dataframe=df, evaluators=[hallucination_evaluator], provide_explanation=True
    )
    
    qa_correctness_eval_df = run_evals(
    dataframe=df, evaluators=[qa_evaluator], provide_explanation=True
    )
    
    print(hallucination_eval_df)
    print(qa_correctness_eval_df)
    # Assuming qa_correctness_eval_df is a 3D NumPy array
# Reshape it to 2D if necessary
#    qa_correctness_eval_df = np.array(qa_correctness_eval_df)
#    qa_correctness_eval_df = np.array(qa_correctness_eval_df)
#    qa_correctness_eval_df = qa_correctness_eval_df.reshape(-1, 3)
#    qa_correctness_eval_df = pd.DataFrame(qa_correctness_eval_df)

    
    px.Client().log_evaluations(
        SpanEvaluations(
            dataframe=qa_correctness_eval_df,
            eval_name="Q&A Correctness",
        ),
        #DocumentEvaluations(
        #    dataframe=document_relevance_eval_df,
        #    eval_name="Relevance",
        #),
        SpanEvaluations(
            dataframe=hallucination_eval_df,
            eval_name="Hallucination",
        ),

    )
    
    # Example reviews with clear sentiment
    sample_reviews = [
        "The lane departure warning system is amazing! It's saved me from drifting multiple times.",
        "I love the automatic emergency braking. It prevented a potential accident last week.",
        "The blind spot monitoring works well, but the beeping can be annoying sometimes.",
        "The adaptive cruise control is a game changer for highway driving.",
        "The parking sensors are okay, but they're too sensitive and beep constantly.",
        "The rear cross-traffic alert has been incredibly helpful in busy parking lots."
    ]
    
    # Load the reviews
    with open("car_reviews.txt", "w") as f:
        f.write("\n".join(sample_reviews))
    system.load_documents(file_path="car_reviews.txt")
    
    # Have a conversation
    print("\n=== Conversational Document QA ===")
    guard = Guard().use(
    TwoWords(),
)
    # First question
    response = guard(system.chat("What are the main safety features mentioned in the reviews?"))
    print("\nQ: What are the main safety features mentioned in the reviews?")
    print(f"A: {response}")
    
    # Follow-up question
    response = system.chat("Which of those features received the most positive feedback?")
    print("\nQ: Which of those features received the most positive feedback?")
    print(f"A: {response}")
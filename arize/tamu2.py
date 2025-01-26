import os
import logging
import sys
from getpass import getpass
from typing import List, Dict

from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate
from langchain.schema import AIMessage, HumanMessage
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_community.vectorstores import DocArrayInMemorySearch
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain.memory import ConversationBufferMemory
from pydantic.v1 import BaseModel, Field

# OpenTelemetry imports
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor, ConsoleSpanExporter
from opentelemetry.sdk.trace.sampling import ALWAYS_ON

# Setup logging
logging.basicConfig(level=logging.INFO, stream=sys.stdout)

def setup_api_keys():
    """Set up necessary API keys."""
    if not (openai_api_key := os.getenv("OPENAI_API_KEY")):
        openai_api_key = getpass("🔑 Enter your OpenAI API key: ")
    os.environ["OPENAI_API_KEY"] = openai_api_key
    return openai_api_key

def setup_telemetry():
    """Initialize OpenTelemetry with console exporter only"""
    # Create TracerProvider with ALWAYS_ON sampler
    tracer_provider = TracerProvider(sampler=ALWAYS_ON)
    
    # Console exporter for local debugging with SimpleSpanProcessor
    console_exporter = ConsoleSpanExporter()
    console_processor = SimpleSpanProcessor(console_exporter)
    tracer_provider.add_span_processor(console_processor)
    
    # Set the tracer provider
    trace.set_tracer_provider(tracer_provider)
    
    return trace.get_tracer(__name__)

class ToyotaReviewSystem:
    def __init__(self):
        self.openai_api_key = setup_api_keys()
        self.tracer = setup_telemetry()
        
        self.llm = ChatOpenAI(
            model_name="gpt-4-turbo-preview",
            temperature=0
        )
        self.embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
        
        # Initialize chat history and memory
        self.chat_history = ChatMessageHistory()
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            chat_memory=self.chat_history,
            return_messages=True,
            output_key="answer"
        )
        self.setup_components()

    def setup_components(self):
        """Initialize system components"""
        with self.tracer.start_as_current_span("setup_components") as span:
            try:
                self.vector_store = None
                self.setup_conversational_chain()
                span.set_attribute("status", "success")
            except Exception as e:
                span.set_attribute("status", "error")
                span.record_exception(e)
                raise

    def setup_conversational_chain(self):
        """Setup the conversational chain with memory"""
        if not self.vector_store:
            return

        system_template = """You are a Toyota vehicle expert assistant. Use the following review documents to answer questions.
        When answering:
        - Focus on Toyota-specific features and their reception
        - Include customer sentiment and specific examples
        - Reference actual customer experiences from the reviews
        - Maintain context from previous questions
        
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
            combine_docs_chain_kwargs={'prompt': prompt}
        )

    def load_reviews(self, file_path=None, directory_path=None):
        """Load reviews from file or directory"""
        try:
            documents = []
            if file_path:
                loader = TextLoader(file_path)
                documents.extend(loader.load())
            if directory_path:
                loader = DirectoryLoader(directory_path)
                documents.extend(loader.load())

            self.vector_store = DocArrayInMemorySearch.from_documents(
                documents, 
                self.embeddings
            )
            
            self.setup_conversational_chain()
            
        except Exception as e:
            print(f"Error loading documents: {e}")
            raise

    def chat(self, query: str) -> str:
        """Have a conversation about Toyota reviews"""
        with self.tracer.start_as_current_span("chat") as span:
            try:
                if not self.vector_store:
                    raise ValueError("No reviews loaded. Please load reviews first.")

                span.set_attribute("query", query)
                response = self.conversation_chain.invoke({
                    "question": query,
                    "chat_history": self.memory.chat_memory.messages
                })
                
                span.set_attribute("response_length", len(response["answer"]))
                return response["answer"]
                
            except Exception as e:
                span.record_exception(e)
                print(f"Error in chat: {e}")
                raise

def main():
    system = ToyotaReviewSystem()
    
    # Example Toyota reviews
    sample_reviews = [
        "The 2024 Toyota Camry's safety features are outstanding. The pre-collision system worked flawlessly.",
        "Toyota's hybrid system in the RAV4 is incredibly efficient, consistently getting 40+ MPG.",
        "The Lane Departure Alert with Steering Assist on my Highlander is a game changer.",
        "Love the reliability of Toyota vehicles. My Corolla has 200k miles and still running strong.",
        "The infotainment system could use some work, but Toyota Safety Sense makes up for it."
    ]
    
    # Save and load reviews
    with open("toyota_reviews.txt", "w") as f:
        f.write("\n".join(sample_reviews))
    system.load_reviews(file_path="toyota_reviews.txt")
    
    # Interactive chat
    print("\n=== Toyota Review Analysis ===")
    while True:
        query = input("\nAsk about Toyota reviews (or 'quit' to exit): ")
        if query.lower() == 'quit':
            break
        response = system.chat(query)
        print(f"\nResponse: {response}")

if __name__ == "__main__":
    main()

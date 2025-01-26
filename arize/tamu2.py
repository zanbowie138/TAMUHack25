import os
from typing import List, Dict
from langchain_openai import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from phoenix.otel import register
from openinference.instrumentation.openai import OpenAIInstrumentor
from opentelemetry import trace
from opentelemetry.trace import Status, StatusCode
from dotenv import load_dotenv

load_dotenv() # Make sure to have a .env file with OPENAI_API_KEY

# Phoenix setup with better tracing
PHOENIX_API_KEY = os.getenv("PHOENIX_API_KEY")
os.environ["PHOENIX_CLIENT_HEADERS"] = f"api_key={PHOENIX_API_KEY}"
os.environ["PHOENIX_COLLECTOR_ENDPOINT"] = "https://app.phoenix.arize.com"

# Initialize tracer with meaningful name
tracer = trace.get_tracer("car_review_analyzer")
tracer_provider = register()
OpenAIInstrumentor().instrument(tracer_provider=tracer_provider)

# OpenAI setup
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

# Define output schemas
class Quote(BaseModel):
    text: str = Field(description="The text of the customer quote")
    has_more: bool = Field(description="Whether there is more context to this quote")

class SentimentAnalysis(BaseModel):
    total_mentions: int = Field(description="Total number of mentions for this category")
    positive_count: int = Field(description="Number of positive mentions")
    negative_count: int = Field(description="Number of negative mentions")
    summary: str = Field(description="A summary of customer sentiment")
    representative_quotes: List[Quote] = Field(description="List of representative customer quotes")

class ReviewAnalysis(BaseModel):
    total_mentions: int
    positive_mentions: int
    negative_mentions: int
    overall_sentiment: str
    quotes: List[str]

# Create prompt template
review_analysis_prompt = PromptTemplate(
    input_variables=["category", "reviews"],
    template="""
    Analyze the following customer reviews for the category "{category}":

    {reviews}

    Provide a detailed analysis including:
    1. Total number of mentions
    2. Count of positive and negative mentions
    3. A summary of the overall sentiment
    4. Representative quotes from the reviews

    Format the output according to the specified schema.
    """
)

def format_analysis_result(result: ReviewAnalysis) -> str:
    """Format the analysis result into human-readable text."""
    
    output = [
        "\n=== Review Analysis Results ===\n",
        f"📊 Total Reviews Analyzed: {result.total_mentions}",
        f"👍 Positive Mentions: {result.positive_mentions}",
        f"👎 Negative Mentions: {result.negative_mentions}",
        f"\n💭 Overall Sentiment: {result.overall_sentiment}",
        "\n🗣️ Representative Quotes:",
    ]
    
    for i, quote in enumerate(result.quotes, 1):
        output.append(f"  {i}. \"{quote}\"")
    
    return "\n".join(output)

class ReviewAnalyzer:
    def __init__(self):
        self.llm = OpenAI(temperature=0)
        
        # Fixed prompt template with escaped curly braces for the JSON example
        self.prompt = PromptTemplate(
            template="""Analyze these customer reviews for {category} and provide a JSON response:

                    Reviews:
                    {reviews}
                    
                    Provide analysis in this exact JSON format:
                    {{
                        "total_mentions": <number of reviews>,
                        "positive_mentions": <number of positive reviews>,
                        "negative_mentions": <number of negative reviews>,
                        "overall_sentiment": "<positive/negative/neutral>",
                        "quotes": ["quote1", "quote2"]
                    }}""",
            input_variables=["category", "reviews"]
        )
        
        self.parser = PydanticOutputParser(pydantic_object=ReviewAnalysis)
        self.chain = self.prompt | self.llm | self.parser

    def analyze_category(self, category: str, reviews: List[str]) -> ReviewAnalysis:
        with tracer.start_as_current_span("review_analysis") as span:
            # Add context for better tracing
            span.set_attribute("category", category)
            span.set_attribute("review_count", len(reviews))
            
            try:
                result = self.chain.invoke({
                    "category": category,
                    "reviews": "\n".join([f"- {review}" for review in reviews])
                })
                
                # Log success
                span.set_status(Status(StatusCode.OK))
                span.set_attribute("sentiment_ratio", 
                    result.positive_mentions / result.total_mentions)
                
                return result
                
            except Exception as e:
                # Log failures for debugging
                span.set_status(Status(StatusCode.ERROR), str(e))
                span.record_exception(e)
                raise

    def format_output(self, result: ReviewAnalysis) -> str:
        return format_analysis_result(result)

class CarReviewSystem:
    def __init__(self):
        self.llm = OpenAI(temperature=0)
        self.embeddings = OpenAIEmbeddings()
        self.text_splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        self.vector_store = None
        self.setup_review_chain()

    def setup_review_chain(self):
        self.prompt = PromptTemplate(
            template="""Analyze these customer reviews for {category} and provide a JSON response:

                    Reviews:
                    {reviews}
                    
                    Provide analysis in this exact JSON format:
                    {{
                        "total_mentions": <number of reviews>,
                        "positive_mentions": <number of positive reviews>,
                        "negative_mentions": <number of negative reviews>,
                        "overall_sentiment": "<positive/negative/neutral>",
                        "quotes": ["quote1", "quote2"]
                    }}""",
            input_variables=["category", "reviews"]
        )
        
        self.parser = PydanticOutputParser(pydantic_object=ReviewAnalysis)
        self.chain = self.prompt | self.llm | self.parser

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

                texts = self.text_splitter.split_documents(documents)
                self.vector_store = FAISS.from_documents(texts, self.embeddings)
                
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

    def analyze_category(self, category: str, reviews: List[str]) -> ReviewAnalysis:
        with tracer.start_as_current_span("review_analysis") as span:
            # Add context for better tracing
            span.set_attribute("category", category)
            span.set_attribute("review_count", len(reviews))
            
            try:
                result = self.chain.invoke({
                    "category": category,
                    "reviews": "\n".join([f"- {review}" for review in reviews])
                })
                
                # Log success
                span.set_status(Status(StatusCode.OK))
                span.set_attribute("sentiment_ratio", 
                    result.positive_mentions / result.total_mentions)
                
                return result
                
            except Exception as e:
                # Log failures for debugging
                span.set_status(Status(StatusCode.ERROR), str(e))
                span.record_exception(e)
                raise

    def analyze_from_database(self, category: str, search_query: str, k: int = 5) -> ReviewAnalysis:
        """Analyze reviews from the loaded document database"""
        with tracer.start_as_current_span("database_analysis") as span:
            span.set_attribute("category", category)
            span.set_attribute("search_query", search_query)
            
            try:
                relevant_reviews = self.search_reviews(search_query, k)
                result = self.analyze_category(category, relevant_reviews)
                
                span.set_status(Status(StatusCode.OK))
                return result
                
            except Exception as e:
                span.set_status(Status(StatusCode.ERROR), str(e))
                span.record_exception(e)
                raise

    def format_output(self, result: ReviewAnalysis) -> str:
        return format_analysis_result(result)

# Example usage
if __name__ == "__main__":
    system = CarReviewSystem()
    
    # Example 1: Using direct reviews
    print("\n=== Direct Review Analysis ===")
    sample_reviews = [
        "My Toyota Camry has been incredibly reliable for the past 5 years.",
        "The RAV4 Hybrid's fuel efficiency is amazing, getting over 40mpg consistently.",
        "Interior quality is good but some plastics feel cheap.",
        "Safety features like lane departure warning work great.",
        "Engine performance is adequate but not exciting.",
        "Best value for money - Toyota quality never disappoints.",
    ]
    
    result = system.analyze_category("Reliability", sample_reviews)
    print(system.format_output(result))
    
    # Example 2: Using document database
    print("\n=== Database Review Analysis ===")
    # Load documents (assuming you have a reviews directory)
    system.load_documents(directory_path="./car_reviews")
    
    # Analyze reviews from the database
    result = system.analyze_from_database(
        category="Safety Features",
        search_query="crash test safety ratings airbags"
    )
    print(system.format_output(result))
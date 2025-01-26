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
os.environ["OPENAI_API_KEY"] = {OPENAI_API_KEY}

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

# Example usage
if __name__ == "__main__":
    analyzer = ReviewAnalyzer()
    
    sample_reviews = [
        "My Toyota Camry has been incredibly reliable for the past 5 years.",
        "The RAV4 Hybrid's fuel efficiency is amazing, getting over 40mpg consistently.",
        "Interior quality is good but some plastics feel cheap.",
        "Safety features like lane departure warning work great.",
        "Engine performance is adequate but not exciting.",
        "Best value for money - Toyota quality never disappoints.",
    ]
    
    print("\n=== Sample Toyota Reviews ===")
    for i, review in enumerate(sample_reviews, 1):
        print(f"{i}. {review}")
    
    with tracer.start_as_current_span("review_analysis_request") as main_span:
        result = analyzer.analyze_category("Reliability", sample_reviews)
        formatted_output = analyzer.format_output(result)
        print(formatted_output)
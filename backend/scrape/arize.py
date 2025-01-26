from openai import OpenAI
import os
from typing import List
from langchain_openai import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from opentelemetry.instrumentation.openai import OpenAIInstrumentor
from opentelemetry import trace
from phoenix.otel import register

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
        reviews_text = "\n".join([f"- {review}" for review in reviews])

        result = self.chain.invoke({
            "category": category,
            "reviews": reviews_text
        })

        return result

    def format_output(self, result: ReviewAnalysis) -> str:
        return format_analysis_result(result)


def format_analysis_result(result: ReviewAnalysis) -> str:
    """Format the analysis result into a readable string."""

    sentiment_color = {
        "positive": "\033[92m",  # Green
        "negative": "\033[91m",  # Red
        "neutral": "\033[93m",  # Yellow
        "end": "\033[0m"  # Reset
    }

    # Get color based on sentiment ratio
    sentiment_ratio = result.positive_mentions / result.total_mentions
    color = (
        sentiment_color["positive"] if sentiment_ratio > 0.6
        else sentiment_color["negative"] if sentiment_ratio < 0.4
        else sentiment_color["neutral"]
    )

    output = [
        "\n=== Review Analysis Results ===\n",
        f"Total Reviews Analyzed: {result.total_mentions}",
        f"{color}Positive Mentions: {result.positive_mentions}{sentiment_color['end']}",
        f"{color}Negative Mentions: {result.negative_mentions}{sentiment_color['end']}",
        f"\nOverall Sentiment: {color}{result.overall_sentiment}{sentiment_color['end']}",
        "\nRepresentative Quotes:",
    ]

    # Add quotes with bullet points
    for i, quote in enumerate(result.quotes, 1):
        output.append(f"  {i}. {quote}")

    return "\n".join(output)

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


def prepare_data():
    load_dotenv()  # Make sure to have a .env file with OPENAI_API_KEY

    # Phoenix setup
    PHOENIX_API_KEY = os.getenv("PHOENIX_API_KEY")
    os.environ["PHOENIX_CLIENT_HEADERS"] = f"api_key={PHOENIX_API_KEY}"
    os.environ["PHOENIX_COLLECTOR_ENDPOINT"] = "https://app.phoenix.arize.com"
    tracer = trace.get_tracer(__name__)
    tracer_provider = register()
    OpenAIInstrumentor().instrument(tracer_provider=tracer_provider)

    # OpenAI setup
    os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

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



prepare_data()

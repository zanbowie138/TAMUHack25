from fastapi import FastAPI
from tamu import ReviewAnalyzer
from typing import List

app = FastAPI()
analyzer = ReviewAnalyzer()

@app.post("/api/analyze-reviews")
async def analyze_reviews(category: str, reviews: List[str]):
    return analyzer.analyze_category(category, reviews) 
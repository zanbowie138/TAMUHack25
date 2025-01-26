from openai import OpenAI
from typing import List
from dotenv import load_dotenv
from db import Database
from scrape import Review
import pickle
import os

def get_overall_summary(reviews: List[str]) -> str:
    load_dotenv()
    client = OpenAI()
    
    # Combine all reviews into a single text
    combined_reviews = "\n".join(reviews)

    max_tokens = 8192
    if len(combined_reviews) > max_tokens:
        combined_reviews = combined_reviews[:max_tokens]
    
    # Create prompt for overall summary
    prompt = f"""Please provide a concise overall summary of these car reviews. Keep it under 200 words.:

            {combined_reviews}

            Focus on:
            1. General sentiment
            2. Key themes
            """


    
    # Get completion from OpenAI
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=300
    )
    
    # Extract and return the summary
    return response.choices[0].message.content


def fill_summary_table():
    db_params = {
        "dbname": "test_db",
        "user": "postgres",
        "password": "password",
        "host": "localhost",  # Or your database's IP address
        "port": 5433          # Default PostgreSQL port
    }
    
    db = Database(db_params)
    db.connect()
    script_dir = os.path.dirname(__file__)
    with open(os.path.join(script_dir, "db.pickle"), "rb") as f:
        reviews = pickle.load(f)
    
    car_reviews = {}
    for review in reviews:
        key = review.car_name + " " + review.car_year
        if car_reviews.get(key) is None:
            car_reviews[key] = []
        car_reviews[key].append(review.review_text)

    for key, reviews in car_reviews.items():
        car, year = key.split(" ")
        summary = get_overall_summary(reviews)
        # print(f"Summary for {car} {year}: {summary}")
        db.add_summary(car, year, summary)
        
    db.close()

fill_summary_table()

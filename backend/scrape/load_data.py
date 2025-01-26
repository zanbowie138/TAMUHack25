import os
import pickle
from db import Database
from scrape import Review


def load_data(db_params, filepath):
    with open(filepath, "rb") as f:
        reviews = pickle.load(f)
    print("Loaded", len(reviews), "reviews")

    db = Database(db_params)
    db.connect()

    db.clear_table("car_reviews")

    db.add_reviews_bulk(list(r.convert_to_tuple() for r in reviews))
    print("Added reviews to the database")

    db.close()

def main():

    db_params = {
        "dbname": "test_db",
        "user": "postgres",
        "password": "password",
        "host": "localhost",
        "port": 5433
    }

    # Construct the relative path to the db.pickle file
    script_dir = os.path.dirname(__file__)
    filepath = os.path.join(script_dir, 'db.pickle')
    load_data(db_params, filepath)

main()
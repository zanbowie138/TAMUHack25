import os
import pickle
from db import Database
from scrape import Review
from spec_scrape import CarData


def load_reviews_data(db_params, filepath, table_name):
    with open(filepath, "rb") as f:
        reviews = pickle.load(f)
    print("Loaded", len(reviews), "reviews")

    db = Database(db_params)
    db.connect()

    db.clear_table(table_name)

    db.add_reviews_bulk(list(r.convert_to_tuple() for r in reviews))
    print("Added reviews to the database")

    db.close()

def load_car_data(db_params, filepath, table_name):
    with open(filepath, "rb") as f:
        data = pickle.load(f)
    print("Loaded", len(data), "car's data")

    db = Database(db_params)
    db.connect()

    db.clear_table(table_name)

    db.add_data_bulk(list(r.convert_to_tuple() for r in data))
    print("Added car specs to the database")

    db.close()

def load_car_summaries(db_params, filepath, table_name):
    with open(filepath, "rb") as f:
        data = pickle.load(f)
    print("Loaded", len(data), "car summaries")

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
    filepath2 = os.path.join(script_dir, 'datadb.pickle')
    load_reviews_data(db_params, filepath, "car_reviews")
    load_car_data(db_params, filepath2, "cars")

main()
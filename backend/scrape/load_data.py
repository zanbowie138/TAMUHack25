import os
import pickle
from db import Database

class Review:
    def __init__(self, title, car_name, car_year, review_text, rating):
        self.title = title  # Review title
        self.car_name = car_name  # Name of the car (e.g., "Toyota Prius")
        self.car_year = car_year  # Year of the car (e.g., 2023)
        self.review_text = review_text  # Review text
        self.rating = rating  # Rating (out of 5)

    def convert_to_tuple(self):
        return (self.car_name, self.car_year, self.title, self.review_text, self.rating)

    def __str__(self):
        return f"{self.title} - {self.car_name} {self.car_year} - {self.rating}/5 stars\n{self.review_text}"

class CarData:
    def __init__(self, car_model, car_year, msrp, horsepower, mpg, num_seats, drive_type):
        self.car_model = car_model
        self.car_year = car_year
        self.msrp = msrp
        self.horsepower = horsepower
        self.mpg = mpg
        self.num_seats = num_seats
        self.drive_type = drive_type

    def convert_to_tuple(self):
        return (self.car_model, self.car_year, self.msrp, self.horsepower, self.mpg, self.num_seats, self.drive_type)

    def __str__(self):
        return f"{self.car_model} {self.car_year} - MSRP: {self.msrp}, Horsepower: {self.horsepower}, MPG: {self.mpg}, Seats: {self.num_seats}, Drive Type: {self.drive_type}"




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
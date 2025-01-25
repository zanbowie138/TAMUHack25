import psycopg2
from psycopg2 import sql

class Database:
    def __init__(self, db_params):
        self.db_params = db_params
        self.conn = None
        self.cursor = None

    def connect(self):
        try:
            self.conn = psycopg2.connect(**self.db_params)
            self.cursor = self.conn.cursor()
        except Exception as e:
            print("Error connecting to the database:", e)

    def close(self):
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()

    def test_connection(self):
        # Print a row of the car_reviews table
        try:
            self.connect()
            self.cursor.execute("SELECT * FROM car_reviews LIMIT 1")
            row = self.cursor.fetchone()
            print(row)
        except Exception as e:
            print("Error testing connection:", e)
        finally:
            self.close()

    def add_review(self, car_name, car_year, review_title, review_body, review_rating, review_date):
        try:
            self.connect()
            insert_query = sql.SQL("""
                INSERT INTO car_reviews (car_name, car_year, review_title, review_body, review_rating, review_date)
                VALUES (%s, %s, %s, %s, %s, %s)
            """)
            self.cursor.execute(insert_query, (car_name, car_year, review_title, review_body, review_rating, review_date))
            self.conn.commit()
        except Exception as e:
            print("Error adding review:", e)
        finally:
            self.close()

db_params = {
    "dbname": "test_db",
    "user": "postgres",
    "password": "password",
    "host": "localhost",  # Or your database's IP address
    "port": 5433          # Default PostgreSQL port
}

d = Database(db_params)
d.connect()
d.add_review("Toyota Prius", 2023, "Great car!", "I love my Prius!", 5, "2023-08-12")
d.test_connection()
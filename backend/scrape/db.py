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
            
    def get_suggestions(self, query):
        try:
            self.connect()
            self.cursor.execute("SELECT car_model, car_year FROM cars WHERE car_model ILIKE %s", (f"%{query}%",))
            suggestions = [(row[0], row[1]) for row in self.cursor.fetchall()]
            return suggestions
        except Exception as e:
            print("Error getting suggestions:", e)
            return []

    def get_summary(self, car, year):
        try:
            self.connect()
            select = sql.SQL("""
                SELECT sentiment FROM car_sentiment
                JOIN cars ON car_sentiment.car_id = cars.car_id
                WHERE car_model = %s AND car_year = %s
            """)
            self.cursor.execute(select, (car, year))
            summary = self.cursor.fetchone()[0]
            return summary
        except Exception as e:
            print("Error getting summary:", e)
            return None
        finally:
            self.close()

    def get_car_data(self, car, year):
        try:
            self.connect()
            self.cursor.execute("SELECT * FROM cars WHERE car_model = %s AND car_year = %s", (car, year))
            car_data = self.cursor.fetchone()
            return car_data
        except Exception as e:
            print("Error getting car data:", e)
            return None

    def get_models_and_years(self):
        try:
            self.connect()
            self.cursor.execute("SELECT DISTINCT car_model FROM cars")
            models = [row[0] for row in self.cursor.fetchall()]
            self.cursor.execute("SELECT DISTINCT car_year FROM cars")
            years = [row[0] for row in self.cursor.fetchall()]
            return models, years
        except Exception as e:
            print("Error getting models and years:", e)
            return [], []

    def clear_table(self, table_name):
        try:
            self.connect()
            self.cursor.execute(f"DELETE FROM {table_name}")
            self.conn.commit()
        except Exception as e:
            print("Error clearing table:", e)
        finally:
            self.close()

    def add_review(self, car_name, car_year, review_title, review_body, review_rating):
        try:
            self.connect()
            insert_query = sql.SQL("""
                INSERT INTO car_reviews (car_name, car_year, review_title, review_body, review_rating)
                VALUES (%s, %s, %s, %s, %s)
            """)
            self.cursor.execute(insert_query, (car_name, car_year, review_title, review_body, review_rating))
            self.conn.commit()
        except Exception as e:
            print("Error adding review:", e)
        finally:
            self.close()

    def add_summary(self, car, year, summary):
        try:
            self.connect()

            # Insert into cars if not already present
            insert = sql.SQL("""
                INSERT INTO cars (car_model, car_year)
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING
            """)
            self.cursor.execute(insert, (car, year))

            # Get car_id
            select = sql.SQL("""
                SELECT car_id FROM cars WHERE car_model = %s AND car_year = %s
            """)
            self.cursor.execute(select, (car, year))
            car_id = self.cursor.fetchone()[0]
            #
            insert_query = sql.SQL("""
                INSERT INTO car_sentiment (car_id, sentiment)
                VALUES (%s, %s)
                ON CONFLICT (car_id) DO UPDATE SET sentiment = EXCLUDED.sentiment
            """)
            self.cursor.execute(insert_query, (car_id, summary))
            self.conn.commit()
        except Exception as e:
            print("Error adding summary:", e)
        finally:
            self.close()

    def add_reviews_bulk(self, reviews):
        try:
            self.connect()
            insert_query = sql.SQL("""
                INSERT INTO car_reviews (car_name, car_year, review_title, review_body, review_rating)
                VALUES (%s, %s, %s, %s, %s)
            """)
            self.cursor.executemany(insert_query, reviews)
            self.conn.commit()
        except Exception as e:
            print("Error adding reviews in bulk:", e)
        finally:
            self.close()

    def add_data_bulk(self, data):
        try:
            self.connect()
            insert_query = sql.SQL("""
                INSERT INTO cars (car_model, car_year, msrp, horsepower, mpg, num_seats, drive_type)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """)
            self.cursor.executemany(insert_query, data)
            self.conn.commit()
        except Exception as e:
            print("Error adding data in bulk:", e)
        finally:
            self.close()

# db_params = {
#     "dbname": "test_db",
#     "user": "postgres",
#     "password": "password",
#     "host": "localhost",  # Or your database's IP address
#     "port": 5433          # Default PostgreSQL port
# }

# d = Database(db_params)
# d.connect()
# d.add_review("Toyota Prius", 2023, "Great car!", "I love my Prius!", 5, "2023-08-12")
# d.test_connection()
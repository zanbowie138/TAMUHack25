from flask import Flask
from scrape.db import Database

# Create a Flask app
app = Flask(__name__)

db_params = {
        "dbname": "test_db",
        "user": "postgres",
        "password": "password",
        "host": "localhost",
        "port": 5433
}

# Define a route
@app.route('/<car>/<year>/summary')
def car_summary(car, year):
    # Logic to fetch and return the summary for the given car_string
    db = Database(db_params)
    db.connect()
    summary = db.get_summary(car, year)
    db.close()

    if summary: return {"summary": summary}, 200
    else: return {"error": "Summary not found."}, 400


# Run the server
if __name__ == '__main__':
    app.run(debug=True)
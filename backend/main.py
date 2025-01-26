from flask import Flask
from scrape.db import Database
from flask_cors import CORS

# Create a Flask app
app = Flask(__name__)
CORS(app)

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

@app.route('/<car>/<year>/data')
def car_data(car, year):
    db = Database(db_params)
    db.connect()
    car_data = db.get_car_data(car, year)
    db.close()
    return {"car_data": car_data}, 200
    
@app.route('/cars')
def cars():
    db = Database(db_params)
    db.connect()
    models, years = db.get_models_and_years()
    db.close()
    return {"models": models, "years": years}, 200



# Run the server
if __name__ == '__main__':
    app.run(debug=True)
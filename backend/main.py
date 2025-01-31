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

@app.route('/suggestions/<query>')
def suggestions(query):
    db = Database(db_params)
    db.connect()
    suggestions = db.get_suggestions(query)
    print(f"Query: {query}, Suggestions: {suggestions}")
    db.close()
    return {"suggestions": suggestions}, 200

@app.route('/all_cars')
def all_cars():
    db = Database(db_params)
    db.connect()
    all_cars = db.get_all_car_data()
    db.close()
    return {"all_cars": all_cars}, 200



# Run the server
if __name__ == '__main__':
    # db = Database(db_params)
    # db.test_connection()
    # db.close()
    
    app.run(debug=True)
from db import Database
import pickle


def pickle_car_summaries(filepath):
    db_params = {
        "dbname": "test_db",
        "user": "postgres", 
        "password": "password",
        "host": "localhost",
        "port": 5433
    }

    db = Database(db_params)
    models, years = db.get_models_and_years()
    print(models, years)

    summaries = []
    for model in models:
        for year in years:
            summary = db.get_summary(model, year)
            if summary:
                summaries.append((model, year, summary))

    with open(filepath, 'wb') as f:
        pickle.dump(summaries, f)
        
    print("Dumped", len(summaries), "car summaries")
    
    db.close()

pickle_car_summaries("car_summaries.pickle")

import pickle
import json
import os

def convert_pickle_to_json():
    # Load the pickle file
    script_dir = os.path.dirname(__file__)
    filepath = os.path.join(script_dir, 'car_summaries.pickle')
    with open(filepath, 'rb') as f:
        data = pickle.load(f)
    
    # Convert to a more readable format
    formatted_data = {}
    for item in data:
        formatted_data[item[0] + " " + item[1]] = {
            "sentiment": item[2]
        }
    
    # Write to JSON file
    with open('car_summaries.json', 'w', encoding='utf-8') as f:
        json.dump(formatted_data, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    convert_pickle_to_json()
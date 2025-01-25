import requests
from bs4 import BeautifulSoup

session = requests.Session()

# base url for the toyota reviews
base_url = "https://www.edmunds.com/toyota"

cars = ['prius', 'camry', 'corolla', 'highlander', 'rav4', 'sienna', 'tacoma', 'tundra']
years = ['2025', '2024', '2023', '2022']

# TODO: loop through the cars and years, for now just using static request for one of the review pages

test_url = f"{base_url}/prius/2023/consumer-reviews/"

# Add headers to mimic a browser
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Referer": "https://www.edmunds.com/toyota",
}

# Fetch the webpage
response = session.get(test_url, headers=headers)
if response.status_code == 200:
    print("Successfully fetched the page!")
else:
    print(f"Failed to fetch the page. Status code: {response.status_code}")
    exit()
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
import time

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

class Review:
    def __init__(self, title, car_name, car_year, review_text, rating, review_date):
        self.title = title           # Review title
        self.car_name = car_name     # Name of the car (e.g., "Toyota Prius")
        self.car_year = car_year     # Year of the car (e.g., 2023)
        self.review_text = review_text          # Review text
        self.rating = rating         # Rating (out of 5)
        self.review_date = review_date  # Date of the review (e.g., "2023-08-12")

# base url for the toyota reviews
base_url = "https://www.edmunds.com/toyota"

cars = ['prius', 'camry', 'corolla', 'highlander', 'rav4', 'sienna', 'tacoma', 'tundra']
years = ['2025', '2024', '2023', '2022']

# TODO: loop through the cars and years, for now just using static request for one of the review pages

test_url = f"{base_url}/prius/2023/consumer-reviews/?pagesize=50"

# Add headers to mimic a browser
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Referer": "https://www.edmunds.com/toyota",
}

# Fetch the webpage
driver.get(test_url)

# Wait for the page to load (adjust time if necessary)
time.sleep(5)

# Find the first div with aria-label containing 'review-item'
review_divs = driver.find_elements(By.CLASS_NAME, "review-item")

# store reviews in list
reviews = []

for review_div in review_divs:
    title = review_div.find_element(By.CLASS_NAME, "heading-5").text
    car_name = 'prius'
    car_year = 2023
    review_text_html = review_div.find_element(By.CLASS_NAME, "truncated-text")
    soup = BeautifulSoup(review_text_html, "html.parser")
    review_text = soup.get_text(separator=" ").strip()
    print(review_text)
    print()
    print()
    print()



# Close the WebDriver
driver.quit()

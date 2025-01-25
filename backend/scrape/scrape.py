from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import time
import pickle

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

def main(filename, cars, years):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    # base url for the toyota reviews
    base_url = "https://www.edmunds.com/toyota"

    cars = ['prius', 'camry', 'corolla', 'highlander', 'rav4', 'sienna', 'tacoma', 'tundra']
    years = ['2025', '2024', '2023', '2022', '2021', '2020']

    # cars = ['prius']
    # years = ['2025']

    # test_url = f"{base_url}/prius/2023/consumer-reviews/?pagesize=50"

    # Add headers to mimic a browser
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Referer": "https://www.edmunds.com/toyota",
    }

    # Fetch the webpage
    # driver.get(test_url)

    # Wait for the page to load (adjust time if necessary)

    # store reviews in list
    reviews = []

    for car in cars:
        for year in years:

            url = f"{base_url}/{car}/{year}/consumer-reviews/?pagesize=50"
            car_name = car
            car_year = year

            driver.get(url)

            time.sleep(5)

            review_divs = driver.find_elements(By.CLASS_NAME, "review-item")

            for review_div in review_divs:
                title = review_div.find_element(By.CLASS_NAME, "heading-5").text

                review_text_html = review_div.find_element(By.CLASS_NAME, "truncated-text").get_attribute('innerHTML')
                soup = BeautifulSoup(review_text_html, "html.parser")
                review_text = soup.get_text(separator=" ").strip()

                # Extracting rating (out of 5)
                review_stars_div = review_div.find_element(By.CLASS_NAME, "rating-stars")
                star_elements = review_stars_div.find_elements(By.CLASS_NAME, "rating-star")
                # Count the number of full stars (icon-star-full)
                rating = sum(1 for star in star_elements if "icon-star-full" in star.get_attribute("class"))

                reviews.append(Review(title, car_name, car_year, review_text, rating))

            # don't get flagged by edmunds
            time.sleep(5)

    # Close the WebDriver
    driver.quit()

    print(reviews)

    with open("db.pickle", "wb") as f:
        pickle.dump(reviews, f)

    # with open("db.pickle", "rb") as f:
    #     phone = pickle.load(f)
    #     for p in phone:
    #         print(p)

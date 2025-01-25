-- Database: test_db

-- DROP DATABASE IF EXISTS test_db;

CREATE DATABASE test_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE TABLE car_reviews (
    review_id SERIAL PRIMARY KEY,       -- Unique identifier for each review
    car_name VARCHAR(100) NOT NULL,    -- Name of the car (e.g., "Corolla")
    car_year INT,                        -- Year of the car (e.g., 2020)
    review_title TEXT,                 -- Title of the review
    review_body TEXT NOT NULL,         -- Full text of the review
    review_rating FLOAT,         -- Rating (e.g., 4.5/5)
    review_date DATE DEFAULT CURRENT_DATE -- Date the review was scraped
);
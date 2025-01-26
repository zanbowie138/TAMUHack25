# How to run backend locally

1. Download docker desktop and open the application in the background
2. Run ``docker compose up -y`` in terminal
3. go to localhost:5051
4. login is admin@admin.com
5. password is password
6. right click on server, click register new database
7. enter any name
8. for the connection:
   1. go to docker desktop and look for the container named backend
   2. click on the 3 dots and click more info
   3. click on the three dots next to <name_of_container> not the one with admin in its name, click more info
   4. click on inspect tab
   5. scroll to bottom
   6. copy second ip address near the bottom
   7. paste that address into the connection
   8. user is postgres
   9. password is password
9. save
10. click on the server and go to test_db
11. inside test_db go to schemas
12. right click on tables and click SQL query
13. paste in and run the table create script (comment out the first command if necessary)
14. run
15. run load_data.py
16. run main.py
17. backend is now running

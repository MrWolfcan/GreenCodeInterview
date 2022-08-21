GREEN CODE TEST
===============

UI TEST:
_________
Technology used: node.js, selenium webdriver, chrome driver
To execute tests, please follow these steps:
1) install all dependencies from package.json with running 'npm install' within the directory which contains package.json
2) download chromedriver (at least 104) and set it to the $PATH (download: https://chromedriver.chromium.org/downloads)
3) download the latest Chrome web browser.
4) cd into project directory and run 'npm test'
5) if there is a lot of free RAM on your device, you can try to add '--parallel' into "test" within package.json
which will run test simultaneously. If you have problems with timeout, set higher limit on the same place.
6) if everything runs fine, you should get same output as you can see in 'output1.png' and 'output2.png'.

(7) Tests were supposed to run on the Selenium grid at 'http://81.95.108.25:4444/' from Jenkins job at 'http://81.95.108.25:8080/',
unfortunately there are some issues with web elements and callbacks on the grid. I tried to make it work, but I wasn't able to fix it in time.
Always when I do this, there is a lot of debugging, because the grid handles tests differently then local. (At least it seems that way)

Also, I totally forgot about comments, please write your questions down and I will try my best to explain.

API TEST:
__________

Technology used: postman, newman, js
To execute tests, please follow these steps:
1)Type 'http://81.95.108.25:8080/' into web browser. There is instance of Jenkins.
2)Login with these credentials:

login: greencode
password: greencode987-

3)Select job named 'CurrentWeather' and click 'Build Now' in left navbar.
4)After build is complete (it will be red) click on last build and select 'Console Output'. On the bottom, there is simple
table with test results.

You can also run these tests locally. To do that just download 'weather_api_collection.json' and 'weather_api_environment.json' and import them into local postman.

Unfortunately I sacrificed most of the time to UI test, so API test collection is not so 'juicy'.
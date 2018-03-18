# stockalyzer
Web application for analyzing stocks/cryptocurrencies.
![landingPage](https://github.com/mbartido/stockalyzer/blob/master/front-end/src/assets/images/landingPage.png)

# Requirements
1. You will need to get an API key from https://www.alphavantage.co/support/. Place this in front-end in a file called config.js. config.js will have the following layout.
~~~~
var config = {
   "ALPHA_KEY": ''
};
export { config };
~~~~
2. Place your key in between the quotes in ALPHA_KEY.


# Installation & Build
1. Install mongoDB: https://www.mongodb.com/download-center#community. 
2. Install nodejs: https://nodejs.org/en/. Download 8.9.4.
3. npm install -g gulp bower generator-gulp-angular
4. npm install & bower install
    1. If any problems come up, delete node_modules and npm install.
    2. If needed, go to package.json, and manually change gulp-sass to version 3.1.0.
5. To run: cd front-end; gulp serve
	



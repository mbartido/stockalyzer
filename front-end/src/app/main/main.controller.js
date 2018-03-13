import {stockList} from '../../assets/scripts/stocks.js';
import {config} from '../../assets/scripts/config.js';
import {digitalList} from '../../assets/scripts/digitalCurrencyList.js';
import {physicalList} from '../../assets/scripts/physicalCurrencyList.js';

export class MainController {
  constructor ($scope, $http, priceList) {
    'ngInject';
    $scope.realList;
    this.getRealList($scope);
    $scope.cryptoList;
    this.getCryptoList($scope);
    $scope.marketList;
    this.getMarketList($scope);
    $scope.pList = [];    // controller's price list
    $scope.dList = [];    // controller's date list

    //$scope.exList = priceList.list;
    //console.log($scope.exList);

    $scope.currentTitle;
    $scope.currentGraphTitle;
    $scope.selectionTime = "Daily";
    $scope.selection1;
    $scope.selection2;

    $scope.selectionTimeCrypto = "Daily";
    $scope.selection1Crypto;
    $scope.selection2Crypto;
    $scope.marketSelection = "(USD) United States Dollar";

    // Analysis Portion
    $scope.cryptoAnalysisMarket;
    $scope.cryptoAnalysisInterval;
    $scope.cryptoAnalysisRefresh;
    $scope.cryptoAnalysisTimeZone;
    $scope.cryptoAnalysisCurrRate;
    $scope.cryptoAnalysisAsOf;
    $scope.high = 0;
    $scope.low = 0;
    $scope.midPrice = 0;
    $scope.rsi = 0;

    // downloads canvas
    $scope.downloadGraph = function() {
        var canvas = document.getElementById('graph');
        var link = document.createElement('a');
        link.download = "graph.png";
        link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        link.click();
    }

    $scope.setTitle = function() {
        if(this.selection1 == ""){
            this.currentTitle = this.selection2.Name + " [" + this.selection2.Symbol + "]";
        }else{
            this.currentTitle = this.selection1;
        }
        this.currentGraphTitle = this.currentTitle + ": Date vs. Price";
    }

    $scope.setTitleCrypto = function() {
        if(this.selection1Crypto == ""){
            this.currentTitle = this.selection2Crypto["currency name"] + " [" + this.selection2Crypto["currency code"] + "]";
        }else{
            this.currentTitle = this.selection1Crypto;
        }
        this.currentGraphTitle = this.currentTitle + ": Date vs. Price";
    }

    $scope.setAnalysis = function(str){
        var s = document.getElementById("stockAnalysis");
        var c = document.getElementById("cryptoAnalysis");
        if(str == "stock"){
            s.style.display = "block";
            c.style.display = "none";
        }else{
            c.style.display = "block";
            s.style.display = "none";
        }
    }

    //Start typeahead search bar data
    var _selected;
    $scope.ngModelOptionsSelected = function(value) {
      if (arguments.length) {
        _selected = value;
      } else {
        return _selected;
      }
    };
    $scope.modelOptions = {
      debounce: {
      default: 500,
      blur: 250
      },
    getterSetter: true
    };
    //End typeahead searchbar data

    // Start of button group for graph
    $scope.singleModel = 1;

    $scope.radioModel = '100%';
  
    $scope.checkModel = {
      '25%': false,
      '50%': false,
      '75%': false,
      '100%': false
    };
  
    $scope.checkResults = [];
  
    $scope.$watchCollection('checkModel', function () {
      $scope.checkResults = [];
      angular.forEach($scope.checkModel, function (value, key) {
        if (value) {
          $scope.checkResults.push(key);
        }
      });
    });
    // End of button for graph

    // http function
    this.$http = $http;

    $scope.apiCall = function(sel1, sel2, time) {
        var chosenStock;
        if(sel1 == ""){
            chosenStock = sel2.Symbol;
        }else{
            var m = sel1.match(/\[(.*)\]/);
            chosenStock = m[1];
        }
        var timestamp;
        var timeJSONTitle;
        var intradayInterval = "";
        if(time == "Daily"){
            timestamp = "DAILY";
            timeJSONTitle = "Time Series (Daily)";
        }
        if(time == "Weekly"){
            timestamp = "WEEKLY";
            timeJSONTitle = "Weekly Time Series";
        }
        if(time == "Monthly"){
            timestamp = "MONTHLY";
            timeJSONTitle = "Monthly Time Series";
        }
        if(time == "Right Now"){
            timestamp = "INTRADAY";
            //current default intraday time is 30 min, could put another selection option for user to choose
            timeJSONTitle = "Time Series (30min)";
            intradayInterval = "&interval=30min&outputsize=compact";
        }
        timestamp = "TIME_SERIES_" + timestamp;
    
        $scope.pList = [];      // clear controller's price list
        $scope.dList = [];      // clear controller's date list
        priceList.price_list = [];    // clear the shared price list
        priceList.date_list = [];     // clear the shared date list
        priceList.currency = "USD";
        $http.get("https://www.alphavantage.co/query?function=" + timestamp + "&symbol=" + 
            chosenStock + intradayInterval + "&apikey=" + config.ALPHA_KEY).
            then(function(response) {
                for (var date in response.data[timeJSONTitle])  {
                priceList.addDate(date);
                priceList.addPrice(response.data[timeJSONTitle][date]["1. open"]);
                }

                priceList.price_list.reverse();
                priceList.date_list.reverse();
                $scope.pList = priceList.price_list;
                $scope.dList = priceList.date_list;
                $scope.high = Math.max.apply(Math, $scope.pList);
                $scope.low = Math.min.apply(Math, $scope.pList);
                $scope.midPrice = (($scope.high + $scope.low)/ 2).toFixed(2);
                console.log("Date List:");
                console.log($scope.dList);
                console.log("Price List:");
                console.log($scope.pList);
            });

        // for RSI portion
        $http.get("https://www.alphavantage.co/query?function=RSI" + "&symbol=" + chosenStock + 
            "&interval=30min" + "&time_period=10" + "&series_type=close" + "&apikey=" + config.ALPHA_KEY).
            then(function(response){
                // Get latest RSI value
                $scope.rsi = parseFloat(Object.values(response.data["Technical Analysis: RSI"])[0]["RSI"]).toFixed(2);
            });

        this.setAnalysis("stock");
    }


    $scope.apiCallCrypto = function(sel1, sel2, time, selMarket){
        var chosenCrypto;
        if(sel1 == ""){
        chosenCrypto = sel2["currency code"];
        }else{
        var m = sel1.match(/\[(.*)\]/);
        chosenCrypto = m[1];
        }
        var n = selMarket.match(/\((.*)\)/);
        var market = n[1];
        var timestamp;
        var timeJSONTitle = "Time Series (Digital Currency " + time + ")";
        var priceJSONString = "1a. open (" + market + ")";
        if(time == "Daily"){
        timestamp = "DAILY";
        }
        if(time == "Weekly"){
        timestamp = "WEEKLY";
        }
        if(time == "Monthly"){
        timestamp = "MONTHLY";
        }
        if(time == "Right Now"){
        timestamp = "INTRADAY";
        timeJSONTitle = "Time Series (Digital Currency Intraday)";
        priceJSONString = "1a. price (" + market + ")";
        }
        timestamp = "DIGITAL_CURRENCY_" + timestamp;

        $scope.pList = [];      // clear controller's price list
        $scope.dList = [];      // clear controller's date list
        priceList.price_list = [];    // clear the shared price list
        priceList.date_list = [];     // clear the shared date list
        $scope.cryptoAnalysisMarket = "";
        $scope.cryptoAnalysisInterval = "";
        $scope.cryptoAnalysisRefresh = "";
        $scope.cryptoAnalysisTimeZone = "";
        $scope.cryptoAnalysisCurrRate = "";
        $scope.cryptoAnalysisAsOf = "";
        priceList.currency = market;
        $http.get("https://www.alphavantage.co/query?function=" + timestamp + "&symbol=" + chosenCrypto + "&market=" + market + "&apikey=" + config.ALPHA_KEY).
        then(function(response){
            console.log(response);
            if(response.data["Meta Data"] == null){
                console.log("no graph/trend data");
                $scope.cryptoAnalysisMarket = selMarket;
                $scope.cryptoAnalysisRefresh = "No trend data available for this crypto currency. Please try a again later, or try your search again with a more popular exchange market.";
                $scope.currentGraphTitle = "No Graph Available";
            }else{
                $scope.cryptoAnalysisMarket = selMarket;
                if(time == "Right Now"){
                    $scope.cryptoAnalysisInterval = "Interval between points: " + response.data["Meta Data"]["6. Interval"];
                    $scope.cryptoAnalysisRefresh = response.data["Meta Data"]["7. Last Refreshed"];
                    $scope.cryptoAnalysisTimeZone = response.data["Meta Data"]["8. Time Zone"];
                }else{
                    $scope.cryptoAnalysisInterval = "";
                    $scope.cryptoAnalysisRefresh = response.data["Meta Data"]["6. Last Refreshed"];
                    $scope.cryptoAnalysisTimeZone = response.data["Meta Data"]["7. Time Zone"];
                }
                $scope.cryptoAnalysisRefresh = "Last Refreshed: " + $scope.cryptoAnalysisRefresh;
                $scope.cryptoAnalysisTimeZone = "Time Zone: " + $scope.cryptoAnalysisTimeZone;
                for (var date in response.data[timeJSONTitle])  {
                    priceList.addDate(date);
                    priceList.addPrice(response.data[timeJSONTitle][date][priceJSONString]);
                }
                priceList.price_list.reverse();
                priceList.date_list.reverse();
                $scope.pList = priceList.price_list;
                $scope.dList = priceList.date_list;
                console.log("Date List:");
                console.log($scope.dList);
                console.log("Price List:");
                console.log($scope.pList);
            }
        });

        $http.get("https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=" + chosenCrypto + "&to_currency=" + market + "&apikey=" + config.ALPHA_KEY).
        then(function(response){
            console.log(response);
            if(response.data["Realtime Currency Exchange Rate"] == null){
                console.log("no xchange data");
                $scope.cryptoAnalysisAsOf = "No current exchange rate data for this crypto currency. Please try again later.";
            }else{
                $scope.cryptoAnalysisCurrRate = response.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"] + " " + market;
                $scope.cryptoAnalysisAsOf = "As of: " + response.data["Realtime Currency Exchange Rate"]["6. Last Refreshed"] + " (" + response.data["Realtime Currency Exchange Rate"]["7. Time Zone"] + ")";
            }
        });
        this.setAnalysis("crypto");
    }

}

  // Get list of names of stocks
  getRealList($scope) {
    var realListRet = [];
    // Put names from stockList in nameList
    for (var i = 0; i < stockList.length; i++) {
      realListRet.push(stockList[i]);
    }
    $scope.realList = realListRet;
  }

  getCryptoList($scope) {
      var cryptoListRet = [];
      for (var i=0; i<digitalList.length; i++){
          cryptoListRet.push(digitalList[i]);
      }
      $scope.cryptoList = cryptoListRet;
  }

  getMarketList($scope) {
      var marketListRet = [];
      for (var i=0; i<physicalList.length; i++){
          marketListRet.push(physicalList[i]);
      }
      $scope.marketList = marketListRet;
  }

}

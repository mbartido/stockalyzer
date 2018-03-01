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
    $scope.selectionTime = "Daily";
    $scope.selection1;
    $scope.selection2;

    $scope.selectionTimeCrypto = "Daily";
    $scope.selection1Crypto;
    $scope.selection2Crypto;
    $scope.marketSelection = "(USD) United States Dollar";


    $scope.setTitle = function() {
        if(this.selection1 == ""){
            this.currentTitle = this.selection2.Name + " [" + this.selection2.Symbol + "]";
        }else{
            this.currentTitle = this.selection1;
        }
    }

    $scope.setTitleCrypto = function() {
        if(this.selection1Crypto == ""){
            this.currentTitle = this.selection2Crypto["currency name"] + " [" + this.selection2Crypto["currency code"] + "]";
        }else{
            this.currentTitle = this.selection1Crypto;
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
        console.log(chosenStock);
        console.log(time);
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
        console.log(timestamp);
    
        //var retList = [];
        $scope.pList = [];      // clear controller's price list
        $scope.dList = [];      // clear controller's date list
        priceList.price_list = [];    // clear the shared price list
        priceList.date_list = [];     // clear the shared date list
        $http.get("https://www.alphavantage.co/query?function=" + timestamp + "&symbol=" + chosenStock + intradayInterval + "&apikey=" + config.ALPHA_KEY).
        then(function(response) {
            //console.log(response.data[timeJSONTitle]);
            for (var date in response.data[timeJSONTitle])  {
              priceList.addDate(date);
              //retList.push(response.data[timeJSONTitle][date]["1. open"]);
              priceList.addPrice(response.data[timeJSONTitle][date]["1. open"]);
            }
            //retList.reverse();
            priceList.price_list.reverse();
            priceList.date_list.reverse();
            $scope.pList = priceList.price_list;
            $scope.dList = priceList.date_list;
            console.log("Date List:");
            console.log($scope.dList);
            console.log("Price List:");
            console.log($scope.pList);
            //$scope.priceList.reverse();
        });
    }
  }


  apiCallCrypto($http, $scope, sel1, sel2, time){
    var chosenCrypto;
    if(sel1 == ""){
      chosenCrypto = sel2["currency code"];
    }else{
      var m = sel1.match(/\[(.*)\]/);
      chosenCrypto = m[1];
    }
    console.log(chosenCrypto);
    var timestamp;
    var timeJSONTitle;
    var intradayInterval = "";
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
    }else{
      timeJSONTitle = "Time Series (Digital Currency " + time + ")";
    }
    timestamp = "DIGITAL_CURRENCY_" + timestamp;
    console.log(timestamp);
    console.log(timeJSONTitle);

    var retList = [];
    this.$http.get("https://www.alphavantage.co/query?function=" + timestamp + "&symbol=" + chosenCrypto + "&market=USD&apikey=" + config.ALPHA_KEY).
    then(function(response){
      console.log(response.data)
    });
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

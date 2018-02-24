import {stockList} from '../../assets/scripts/stocks.js';
import {config} from '../../assets/scripts/config.js';
import {digitalList} from '../../assets/scripts/digitalCurrencyList.js';
import {physicalList} from '../../assets/scripts/physicalCurrencyList.js';

export class MainController {
  constructor ($scope, $http) {
    'ngInject';
    $scope.realList;
    this.getRealList($scope);
    $scope.cryptoList;
    this.getCryptoList($scope);
    $scope.marketList;
    this.getMarketList($scope);

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


  apiCall($http, $scope, sel1, sel2, time) {
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


    var retList = []
    this.$http.get("https://www.alphavantage.co/query?function=" + timestamp + "&symbol=" + chosenStock + intradayInterval + "&apikey=" + config.ALPHA_KEY).
      then(function(response) {
        console.log(response.data[timeJSONTitle]);
        for (var date in response.data[timeJSONTitle])  {
          retList.push(response.data[timeJSONTitle][date]["1. open"]);
        }
        retList.reverse();
      });
    console.log(retList);
  }

    apiCallCrypto($http, $scope, sel1, sel2, time){

        console.log("cryptoCall");


    }
}

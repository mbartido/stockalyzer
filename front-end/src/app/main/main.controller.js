import {stockList} from '../../assets/scripts/stocks.js';
import {config} from '../../assets/scripts/config.js';

export class MainController {
  constructor ($scope, $http) {
    'ngInject';
    $scope.realList;
    $scope.realListWithSymbols;
    $scope.priceList = [];
    this.getRealList($scope);
    this.getRealListWithSymbols($scope);
    //this.apiCall($http, $scope);

    $scope.currentTitle;
    $scope.selectionTime = "Daily";
    $scope.selection1;
    $scope.selection2;
    
    //$scope.stockList; // = stockList[0].Name;
    //this.getStockList($scope);
    //Start typeahead search bar data
    var _selected;
    $scope.selected = undefined;


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

  // Put names from stockList in nameList
  // with their symbols
  getRealListWithSymbols($scope) {
    var realListSymbolsRet = [];
    for (var i = 0; i < stockList.length; i++) {
      realListSymbolsRet.push(
        {
          Name: stockList[i].Name,
          Symbol: stockList[i].Symbol
        }
      );
    }
    $scope.realListWithSymbols = realListSymbolsRet;
  }
  
  // sample API call that logs to console
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
}

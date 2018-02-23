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
    
    // the stock we are searching for when we click search
    $scope.searchStock = function() {
      var chosenStock;
      if(this.selection1 == ""){
          chosenStock = this.selection2.Symbol;
      }else{
          var m = this.selection1.match(/\[(.*)\]/);
          console.log(m);
          chosenStock = m[1];
      }
      console.log(chosenStock);
      console.log(this.selectionTime);
      //find a way to make api call, couldnt get calling it here or copying and pasting the code from apiCall() to work
      //this.apiCall();

    }



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
  apiCall($http, $scope) {
    //$scope.priceList = [];
    var retList = []
    this.$http.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=" + config.ALPHA_KEY).
      then(function(response) {
        console.log(response.data["Time Series (Daily)"]);
        for (var date in response.data["Time Series (Daily)"])  {
          retList.push(response.data["Time Series (Daily)"][date]["1. open"]);
        }
        retList.reverse();
      });
    console.log(retList);
  }
}

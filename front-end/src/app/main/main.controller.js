import {stockList} from '../../assets/scripts/stocks.js';
import {config} from '../../assets/scripts/config.js';

export class MainController {
  constructor ($scope, $http) {
    'ngInject';
    $scope.realList;
    this.getrealList($scope);
//    $scope.stockList; // = stockList[0].Name;
//    this.getStockList($scope);
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

  getrealList($scope) {
    var realListRet = [];
    // Put names from stockList in nameList
    for (var i = 0; i < stockList.length; i++) {
      realListRet.push(stockList[i]);
    }
    $scope.realList = realListRet;
  }

  searchClicked(){
      console.log("clickityclick");
  }
  
  // sample API call that logs to console
  apiCall($http) {
    this.$http.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=" + config.ALPHA_KEY).
      then(function(response) {
        console.log(response);
      });
  }
}

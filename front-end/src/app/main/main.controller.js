import {stockList} from '../../assets/json/stocks.js';
export class MainController {
  constructor ($scope) {
    'ngInject';
      $scope.realList;
      this.getrealList($scope);
    $scope.stockList; // = stockList[0].Name;
    this.getStockList($scope);

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
  }
      getrealList($scope) {
    var realListRet = [];
    // Put names from stockList in nameList
    for (var i = 0; i < stockList.length; i++) {
      realListRet.push(stockList[i]);
    }
    $scope.realList = realListRet;
  }

  // Get stock names in a scope var
  getStockList($scope) {
    var stockListRet = [];
    // Put names from stockList in nameList
    for (var i = 0; i < stockList.length; i++) {
      stockListRet.push(stockList[i].Name);
    }
    $scope.stockList = stockListRet;
    console.log($scope.nameList);
  }
}

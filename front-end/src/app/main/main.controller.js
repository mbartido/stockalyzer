import {stockList} from '../../assets/json/stocks.js';
export class MainController {
  constructor ($scope) {
    'ngInject';
    $scope.stockList; // = stockList[0].Name;
    this.getStockList($scope);
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

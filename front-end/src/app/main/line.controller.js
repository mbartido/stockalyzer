export class LineController {
   constructor($scope, $timeout, $interval, priceList){
      'ngInject';
      $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
      // $scope.labels = priceList.date_list;
      $scope.series = ['Series A', 'Series B'];
      // $scope.series = ['Stock A'];
      $scope.data = [
         [65, 59, 80, 81, 56, 55, 40],
         [28, 48, 40, 19, 86, 27, 90] 
      ];
      
      // $scope.data = [];
      // $scope.data.push(priceList.price_list);
      $scope.onClick = function (points, evt) {
         console.log(points, evt);
      };

      var interval = $interval(function() {
         $scope.labels = priceList.date_list;
         $scope.series = ['Series A'];
         $scope.data = priceList.price_list;
      }.bind(this), 1000)
   }
}
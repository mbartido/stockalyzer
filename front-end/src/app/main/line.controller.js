export class LineController {
   constructor($scope, $timeout, $interval, priceList){
      'ngInject';
      $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
      $scope.series = ['Series A'];
      $scope.data = [
         [0,1,2,3,4,5,6],
         [0,1,2,3,4,5,6] 
      ];
      
      $scope.onClick = function (points, evt) {
         console.log(points, evt);
      };

      var interval = $interval(function() {
         $scope.labels = priceList.date_list;
         $scope.series = ['Series A'];
         $scope.data = priceList.price_list;

      $scope.lineOptions = {
         elements: {
             line: {
                 tension: 0, // disables bezier curves
                 fill: origin,
                 borderColor: '#34ba77'
             },
             point: {
                 radius: 0
             }
         },
         scales: {
            xAxes:[{
               scaleLabel: {
                  display: true,
                  labelString: 'Dates'
               }
            }],
            yAxes:[{
               scaleLabel: {
                  display: true,
                  labelString: 'Price (' + priceList.currency + ')'
               }
            }]
         }
      }

       }.bind(this), 1000)

   }
}

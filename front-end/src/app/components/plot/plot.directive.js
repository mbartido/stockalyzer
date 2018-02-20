export function PlotDirective() {
   'ngInject';
   
   let directive = {
      restrict: 'E',
      templateUrl: 'app/components/plot/plot.html',
      scope: {
      },
      controller: PlotController,
      controllerAs: 'vm',
      bindToController: true
   };

   return directive;
}

class PlotController {
   constructor ($scope) {
      'ngInject';

   }
}
export class PriceListService {
   constructor() {
      'ngInject';
      var PriceList = {};
      
      PriceList.price_list = [];   // holds the prices of the api call - y axis
      PriceList.date_list = [];    // holds the dates of the api call - x axis

      // adds price to price list
      PriceList.addPrice = function(price) {
         PriceList.price_list.push(price);
      }
      
      // adds date to date list
      PriceList.addDate = function(date) {
         PriceList.date_list.push(date);
      }

      return PriceList; 

   }
}
'use strict';

/**
 * @ngdoc filter
 * @name dockstore.ui.filter:PaginationFilter
 * @function
 * @description
 * # PaginationFilter
 * Filter in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .filter('PaginationFilter', [function () {
    return function (containers, rangeObj) {
      return rangeObj ?
        containers.slice(rangeObj.start, rangeObj.end + 1) : containers;
    };
  }]);

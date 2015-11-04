'use strict';

/**
 * @ngdoc filter
 * @name dockstore.ui.filter:PreviewFilter
 * @function
 * @description
 * # PreviewFilter
 * Filter in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .filter('PreviewFilter', [function () {
    return function (containers, contLimit) {
      if (!contLimit) return containers;
      var sortedByBuildTime = containers.sort(function(a, b) {
        return a.lastBuild - b.lastBuild;
      });
      for (var i = 0; i < sortedByBuildTime.length; i++) {
        console.log(sortedByBuildTime[i].lastBuild, sortedByBuildTime[i].name);
      }
      return sortedByBuildTime.slice(0, contLimit - 1);
    };
  }]);

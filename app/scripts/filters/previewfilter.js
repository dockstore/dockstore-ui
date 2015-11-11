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
      	if (!a.lastBuild) a.lastBuild = Number.MAX_VALUE;
      	if (!b.lastBuild) b.lastBuild = Number.MAX_VALUE;
        return a.lastBuild - b.lastBuild;
      });
      return sortedByBuildTime.slice(0, contLimit - 1);
    };
  }]);

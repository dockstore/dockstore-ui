'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:containersGrid
 * @description
 * # containersGrid
 */
angular.module('dockstore.ui')
  .directive('containersGrid', function () {
    return {
      restrict: 'AE',
      controller: 'ContainersGridCtrl',
      scope: {
        containers: '=',
        previewMode: '=',
        searchQuery: '='
      },
      templateUrl: 'templates/containersgrid.html',
      link: function postLink(scope, element, attrs) {
        scope.$watchCollection('filteredContainers',
          function(newVal, oldVal, scope) {
            if (newVal) {
              scope.currPage = 1;
            }
        });
      }
    };
  });

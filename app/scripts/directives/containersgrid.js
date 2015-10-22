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
        containers: '='
      },
      templateUrl: 'templates/containersgrid.html',
      link: function postLink(scope, element, attrs) {
        scope.$watch('containers', function(newVal, oldVal) {
          if (newVal) {
            scope.refreshPagination();
          }
        }, true);
      }
    };
  });

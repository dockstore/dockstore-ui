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
      templateUrl: 'templates/containersgrid.html',
      link: function postLink(scope, element, attrs) {
        scope.$watch('containerList', function(newVal, oldVal) {
          if (newVal) {
            $(element).find('table').DataTable({
              columns: [
                { width: '40%' },
                { width: '20%' },
                { width: '40%' }
              ],
              search: {
                smart: true,
                caseInsensitive: true
              }
            });
          }
        }, true);
      }
    };
  });

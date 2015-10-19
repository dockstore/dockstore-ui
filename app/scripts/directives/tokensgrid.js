'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:tokensGrid
 * @description
 * # tokensGrid
 */
angular.module('dockstore.ui')
  .directive('tokensGrid', function () {
    return {
      restrict: 'AE',
      templateUrl: 'templates/tokensgrid.html',
      link: function postLink(scope, element, attrs) {
        $(element).on('click', 'a[data-token-id]', function() {
          scope.deleteToken($(this).data('token-id'))
            .then(function(response) {
              scope.dataTable.row($(this).closest('tr')).remove().draw();
            });
        });
        scope.$watch('userTokens', function(newVal, oldVal) {
          if (newVal) {
            scope.dataTable = $(element).find('table').DataTable({
              columns: [
                { width: '15%' },
                { width: '15%' },
                { width: '50%', orderable: false },
                { width: '20%', orderable: false }
              ]
            });
          }
        }, true);
      }
    };
  });

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
      controller: 'TokensGridCtrl',
      scope: {
        tokens: '=',
        deleteToken: '&'
      },
      templateUrl: 'templates/tokensgrid.html',
      link: function postLink(scope, element, attrs) {
        scope.$watchCollection('filteredTokens',
          function(newVal, oldVal, scope) {
            if (newVal) {
              scope.refreshPagination();
            }
        });
        scope.$watch('numTknsPage',
          function(newVal, oldVal, scope) {
            if (newVal) {
              scope.refreshPagination();
            }
        });
      }
    };
  });

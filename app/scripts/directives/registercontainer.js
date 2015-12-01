'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:registerContainer
 * @description
 * # registerContainer
 */
angular.module('dockstore.ui')
  .directive('registerContainer', function () {
    return {
      restrict: 'AE',
      controller: 'RegisterContainerCtrl',
      scope: {
      	containerNs: '='
      },
      templateUrl: 'templates/registercontainer.html',
      link: function postLink(scope, element, attrs) {
        scope.$watch('containerNs', function(newValue, oldValue, scope) {
          $(element).find('input[name="srcCodeRepository"]').val(
            scope.containerNs ?
              'https://github.com/' + scope.containerNs + '/' : ''
          );
          $(element).find('input[name="imageUrl"]').val(
            scope.containerNs ? scope.containerNs + '/' : ''
          );
        });
      }
    };
  });

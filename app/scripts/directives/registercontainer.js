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
      templateUrl: 'templates/registercontainer.html',
      link: function postLink(scope, element, attrs) {
        
      }
    };
  });

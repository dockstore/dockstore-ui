'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:Navbar
 * @description
 * # Navbar
 */
angular.module('dockstore.ui')
  .directive('navbar', function () {
    return {
      restrict: 'AE',
      controller: 'NavbarCtrl',
      templateUrl: 'templates/navbar.html',
      link: function postLink(scope, element, attrs) {
        scope.$on('userObjChange', function(event, userObj) {
          scope.username = userObj ? userObj.username : '';
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('NavbarCtrl', [
    '$scope',
    '$rootScope',
    '$auth',
    '$location',
    'UserService',
    'NotificationService',
    function ($scope, $rootScope, $auth, $location,
                UserService, NtfnService) {

      $scope.userObj = UserService.getUserObj();

      $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
      };

      $scope.isHomePage = function() {
        return ($location.url() === '/');
      };

      $scope.logout = function() {
        UserService.logout();
      };

      $scope.$watch('searchQuery', function(newValue, oldValue) {
        $rootScope.searchQuery = newValue;
      });

      $scope.$on('$routeChangeStart', function(event, next, current) {
        if ($location.url().indexOf('/search') === -1) {
          $scope.searchQuery = '';
        }
      });

  }]).filter('shortenString', function() {
    return function (string, scope) {
      if (string !== null && string.length > 10) {
        return string.substring(0,9) + '...';
      } else {
        return string;
      }
    };
  });

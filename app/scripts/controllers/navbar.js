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

      $scope.changeMode = function() {
        if ($scope.searchMode === 'Tool') {
          $scope.searchMode = 'Workflow';
        } else if ($scope.searchMode === 'Workflow') {
          $scope.searchMode = 'Tool';
        }
      };

  }]).filter('shortenString', function() {
    return function (string, scope) {
      if (string !== null && string.length > 10) {
        return string.substring(0,9) + '...';
      } else {
        return string;
      }
    };
  });

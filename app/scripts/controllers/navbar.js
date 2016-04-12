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
      $scope.searchMode = 'Tool';

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


      $scope.$watch('searchQueryContainer', function(newValue, oldValue) {
        $rootScope.searchQueryContainer = newValue;
      });

      $scope.$watch('searchQueryWorkflow', function(newValue, oldValue) {
        $rootScope.searchQueryWorkflow = newValue;
      });

      $scope.$on('$routeChangeStart', function(event, next, current) {
        if ($location.url().indexOf('/search-containers') === -1) {
          $scope.searchQueryContainer = '';
        }
      });

      $scope.$on('$routeChangeStart', function(event, next, current) {
        if ($location.url().indexOf('/search-workflows') === -1) {
          $scope.searchQueryWorkflow = '';
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

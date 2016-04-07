'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('SearchCtrl', [
    '$scope',
    '$rootScope',
    '$q',
    '$window',
    '$location',
    '$auth',
    '$routeParams',
    'ContainerService',
    'UserService',
    'TokenService',
    'NotificationService',
    function ($scope, $rootScope, $q, $window, $location, $auth, $routeParams,
        ContainerService, UserService, TokenService, NtfnService) {

      $scope.userObj = UserService.getUserObj();

      $scope.listPublishedContainers = function() {
        return ContainerService.getPublishedContainerList()
          .then(
            function(containers) {
              $scope.containers = containers;
            },
            function(response) {
              var message = '[HTTP ' + response.status + '] ' +
                  response.statusText + ': ' + response.data;
              NtfnService.popError('List Published Containers', message);
              return $q.reject(response);
            }
          );
      };

      if ($auth.isAuthenticated()) {
        TokenService.getUserTokenStatusSet($scope.userObj.id)
          .then(
            function(tokenStatusSet) {
              $scope.tokenStatusSet = tokenStatusSet;
              if (!tokenStatusSet.github) {
                $window.location.href = '/onboarding';
              }
            }
          );
      }

      if ($routeParams.searchQueryContainer) {
        $rootScope.searchQueryContainer = $routeParams.searchQueryContainer;
      }

      $scope.listPublishedContainers();

  }]);

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
    '$window',
    '$auth',
    'ContainerService',
    'UserService',
    'TokenService',
    'NotificationService',
    function ($scope, $window, $auth, ContainerService,
        UserService, TokenService, NtfnService) {

      $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
      };

      $scope.listContainers = function() {
        NtfnService.popInfo('List Docker Containers',
          'Loading container lists...');
        ContainerService.getDockerContainerList()
          .then(function(containers) {
            NtfnService.clearAll();
            $scope.containers = containers;
          })
          .catch(function(response) {
            var message = (typeof response.statusText !== 'undefined') ?
              response.statusText : 'Unknown Error.';
            NtfnService.popError('List Docker Containers', message);
          });
      };

      if ($scope.isAuthenticated()) {
        TokenService.hasGitHubQuayIOTokens(UserService.getUserObj().id)
          .then(function(hasBothTokens) {
            if (!hasBothTokens) $window.location.href = '#/onboarding';
          });
      }

      $scope.listContainers();
      
  }]);

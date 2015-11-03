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
    '$q',
    '$window',
    '$auth',
    'ContainerService',
    'UserService',
    'TokenService',
    'NotificationService',
    function ($scope, $q, $window, $auth,
        ContainerService, UserService, TokenService, NtfnService) {

      $scope.userObj = UserService.getUserObj();

      $scope.listRegisteredContainers = function() {
        return ContainerService.getRegisteredContainerList()
          .then(
            function(containers) {
              $scope.containers = containers;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('List Registered Containers', message);
              return $q.reject(response);
            }
          );
      };

      if ($auth.isAuthenticated()) {
        TokenService.getUserTokenStatusSet($scope.userObj.id)
          .then(
            function(tokenStatusSet) {
              $scope.tokenStatusSet = tokenStatusSet;
              if (!(tokenStatusSet.github && tokenStatusSet.quayio)) {
                $window.location.href = '/onboarding';
              }
            }
          );
      }

      $scope.listRegisteredContainers();
      
  }]);

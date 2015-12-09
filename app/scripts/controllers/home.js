'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('HomeCtrl', [
    '$scope',
    '$q',
    'ContainerService',
    'UserService',
    'NotificationService',
    function ($scope, $q, ContainerService, UserService, NtfnService) {

      $scope.userObj = UserService.getUserObj();console.log('is:', $scope.userObj);
    
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

      $scope.listRegisteredContainers();

  }]);

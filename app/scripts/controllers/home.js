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
    'NotificationService',
    function ($scope, $q, ContainerService, NtfnService) {
    
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

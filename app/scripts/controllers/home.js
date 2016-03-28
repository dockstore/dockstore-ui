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

      $scope.listPublishedContainers();

  }]);

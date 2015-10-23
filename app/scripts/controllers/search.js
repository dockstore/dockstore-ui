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
    'ContainerService',
    'NotificationService',
    function ($scope, ContainerService, NtfnService) {

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

      $scope.listContainers();
      
  }]);

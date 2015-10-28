'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:ContainerDetailsCtrl
 * @description
 * # ContainerDetailsCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('ContainerDetailsCtrl', [
    '$scope',
    'ContainerService',
    'NotificationService',
    function ($scope, ContainerService, NtfnService) {

      $scope.loadContainerDetails = function(containerId) {
        NtfnService.popInfo('Docker Container Details',
          'Retrieving container metadata.');
        ContainerService.getDockerContainer(containerId)
          .then(function(containerObj) {
            NtfnService.clearAll();
            $scope.containerObj = containerObj;
          })
          .catch(function(response) {
            var message = (typeof response.statusText !== 'undefined') ?
              response.statusText : 'Unknown Error.';
            NtfnService.popError('Docker Container Details', message);
          });
      };

      $scope.getCollabFile = function(reposPath) {
         NtfnService.popInfo('Docker Container Details',
          'Retrieving CWL Decriptor...');
        ContainerService.getCollabFile(reposPath)
          .then(function(collabFile) {
            NtfnService.clearAll();
            $scope.collabFileString = collabFile;
            $scope.collabFileLoaded = true;
          })
          .catch(function(response) {
            var message = (typeof response.statusText !== 'undefined') ?
              response.statusText : 'Unknown Error.';
            NtfnService.popError('Docker Container Details', message);
          });
      };

      $scope.getDockerFile = function(reposPath) {
         NtfnService.popInfo('Docker Container Details',
          'Retrieving Dockerfile...');
        ContainerService.getDockerFile(reposPath)
          .then(function(dockerFile) {
            NtfnService.clearAll();
            $scope.dockerFileString = dockerFile;
            $scope.dockerFileLoaded = true;
          })
          .catch(function(response) {
            var message = (typeof response.statusText !== 'undefined') ?
              response.statusText : 'Unknown Error.';
            NtfnService.popError('Docker Container Details', message);
          });
      };

      $scope.getVersionTags = function(containerObj) {
        var tags = containerObj ? containerObj.tags : null;
        if (!tags || tags.length === 0) return ['n/a'];
        var versionTags = [];
        var descTags = tags.sort(function(a, b) {
          return b.version.localeCompare(a.version);
        });
        for (var i = 0; i < descTags.length; i++) {
          versionTags.push(descTags[i].version);
        }
        return versionTags;
      };

      $scope.getDateTimeString = function(timestamp) {
        return new Date(timestamp).toUTCString();
      };

      $scope.loadCollabFile = function() {
        if (!$scope.collabFileLoaded) {
          $scope.getCollabFile($scope.containerObj.path);
        }
      };

      $scope.loadDockerFile = function() {
        if (!$scope.dockerFileLoaded) {
          $scope.getDockerFile($scope.containerObj.path);
        }
      }

      $scope.loadContainerDetails($scope.containerId);

  }]);

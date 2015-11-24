'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:ContainerFileViewerCtrl
 * @description
 * # ContainerFileViewerCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('ContainerFileViewerCtrl', [
  	'$scope',
    '$q',
    'ContainerService',
    'NotificationService',
  	function ($scope, $q, ContainerService, NtfnService) {

      $scope.fileLoaded = false;
      $scope.fileContents = null;
    
      $scope.getContainerTags = function() {
        var sortedTagObjs = $scope.containerObj.tags;
        sortedTagObjs.sort(function(a, b) {
          return b.name.localeCompare(a.name);
        });
        var tags = [];
        for (var i = 0; i < sortedTagObjs.length; i++) {
          tags.push(sortedTagObjs[i].name);
        }
        return tags;
      };

      $scope.getDockerFile = function(containerId, tagName) {
        return ContainerService.getDockerFile(containerId)
          .then(
            function(dockerFile) {
              $scope.fileContents = dockerFile;
              return dockerFile;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('Docker Container Details', message);
              return $q.reject(response);
            }
          )
          .finally(
            function() { $scope.fileLoaded = true; }
          );
      };

      $scope.getDescriptorFile = function(containerId, tagName) {
        return ContainerService.getDescriptorFile(containerId)
          .then(
            function(descriptorFile) {
              $scope.fileContents = descriptorFile;
              return descriptorFile;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('Docker Container Details', message);
              return $q.reject(response);
            }
          ).finally(
            function() { $scope.fileLoaded = true; }
          );
      };

      $scope.setDocument = function() {
        $scope.containerTags = $scope.getContainerTags();
        $scope.selTagName = $scope.containerTags[0];
      };

      $scope.refreshDocument = function() {
        $scope.fileLoaded = false;
        switch ($scope.type) {
          case 'dockerfile':
            $scope.expectedFilename = 'Dockerfile';
            $scope.getDockerFile($scope.containerObj.id, $scope.selTagName);
            break;
          case 'descriptor':
            $scope.expectedFilename = 'Dockstore.cwl descriptor';
            $scope.getDescriptorFile($scope.containerObj.id, $scope.selTagName);
            break;
          default:
            // ...
        }
      };

      $scope.setDocument();

  }]);

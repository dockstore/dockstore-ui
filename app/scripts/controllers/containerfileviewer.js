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
          if (a.name === 'latest') return -1;
          if ((new RegExp(/[a-zA-Z]/i).test(a.name.slice(0, 1))) &&
                (new RegExp(/[^a-zA-Z]/i).test(b.name.slice(0, 1)))) return -1;
          /* Lexicographic Sorting */
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        var tags = [];
        for (var i = 0; i < sortedTagObjs.length; i++) {
          tags.push(sortedTagObjs[i].name);
        }
        return tags;
      };

      $scope.getDockerFile = function(containerId, tagName) {
        return ContainerService.getDockerFile(containerId, tagName)
          .then(
            function(dockerFile) {
              $scope.fileContents = dockerFile;
              return dockerFile;
            },
            function(response) {
              return $q.reject(response);
            }
          )
          .finally(
            function() { $scope.fileLoaded = true; }
          );
      };

      $scope.getDescriptorFile = function(containerId, tagName) {
        return ContainerService.getDescriptorFile(containerId, tagName)
          .then(
            function(descriptorFile) {
              $scope.fileContents = descriptorFile;
              return descriptorFile;
            },
            function(response) {
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
        $scope.fileContents = null;
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

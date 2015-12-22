'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:RegisterContainerCtrl
 * @description
 * # RegisterContainerCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('RegisterContainerCtrl', [
    '$scope',
    '$q',
    'ContainerService',
    function ($scope, $q, ContainerService) {
    
      $scope.registerContainer = function() {
        $scope.setContainerEditError(null);
        var containerObj = $scope.getNormalizedContainerObj($scope.containerObj);
        $scope.createContainer(containerObj)
          .then(function(containerObj) {
            $scope.refreshContainer(containerObj.id)
              .then(function(containerObj) {
                $scope.closeRegisterContainerModal(true);
                var savedContainerObj = null;
                $scope.addContainer()(containerObj);
              });
          });
      };

      $scope.createContainer = function(containerObj) {
        if ($scope.savingActive) return;
        $scope.savingActive = true;
        return ContainerService.createContainer(containerObj)
          .then(
            function(containerObj) {
              return containerObj;
            },
            function(response) {
              $scope.setContainerEditError(
                'The webservice encountered an error trying to create this ' +
                'container, please ensure that the container attributes are ' +
                'valid and the same image has not already been registered.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          ).finally(function(response) {
            $scope.savingActive = false;
          });
      };

      $scope.refreshContainer = function(containerId) {
        if ($scope.refreshingContainer) return;
        $scope.refreshingContainer = true;
        return ContainerService.refreshContainer(containerId)
          .then(
            function(containerObj) {
              return containerObj;
            },
            function(response) {
              $scope.setContainerEditError(
                'The webservice encountered an error trying to refresh this ' +
                'container, please ensure that the associated Dockerfile and ' +
                'Dockstore.cwl descriptor are valid and accessible.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          ).finally(function(response) {
            $scope.refreshingContainer = false;
          });
      };

      $scope.getGitUrl = function(gitPath) {
        var gitUrl = '';
        switch ($scope.containerObj.scrProvider) {
          case 'GitHub':
            gitUrl = 'https://github.com/';
            break;
          case 'Bitbucket':
            /* falls through */
          default:
            gitUrl = 'https://bitbucket.org/';
        }
        gitUrl += gitPath;
        return gitUrl;
      };

      $scope.getImagePath = function(imagePath, part) {
        var imagePathRegexp = /^(([a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*)|_)\/([a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*)$/i;
        var matchObj = imagePath.match(imagePathRegexp);
        var imageName = '';
        if (matchObj && matchObj.length > 2) {
          imageName = (part !== 'name') ? matchObj[1] : matchObj[4];
        }
        return imageName;
      };

      $scope.getContainerRegistry = function(irProvider) {
        var registry = '';
        switch (irProvider) {
          case 'Quay.io':
            registry = 'QUAY_IO';
            break;
          case 'Docker Hub':
            /* falls through */
          default:
            registry = 'DOCKER_HUB';
        }
        return registry;
      };

      $scope.getNormalizedContainerObj = function(containerObj) {
        var normContainerObj = {
          mode: 'MANUAL_IMAGE_PATH',
          name: $scope.getImagePath(containerObj.imagePath, 'name'),
          toolname: containerObj.toolname,
          namespace: $scope.getImagePath(containerObj.imagePath, 'namespace'),
          registry: $scope.getContainerRegistry(containerObj.irProvider),
          gitUrl: $scope.getGitUrl(containerObj.gitPath),
          default_dockerfile_path: containerObj.default_dockerfile_path,
          default_cwl_path: containerObj.default_cwl_path,
          is_public: containerObj.is_public,
          is_registered: containerObj.is_registered
        };
        if (normContainerObj.toolname === normContainerObj.name) {
          delete normContainerObj.toolname;
        }
        return normContainerObj;
      };

      $scope.closeRegisterContainerModal = function(toggle) {
        $scope.setContainerEditError(null);
        $scope.registerContainerForm.$setUntouched();
        if (toggle) $scope.toggleModal = true;
      };

      $scope.setContainerEditError = function(message, errorDetails) {
        if (message) {
          $scope.containerEditError = {
            message: message,
            errorDetails: errorDetails
          };
        } else {
          $scope.containerEditError = null;
        }
      };

      $scope.setContainerEditError(null);

  }]);

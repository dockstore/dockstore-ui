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
        if ($scope.savingActive) return;
        $scope.savingActive = true;
        var containerObj = $scope.getNormalizedContainerObj($scope.containerObj);

        console.log('Submitting:', containerObj);
        return ContainerService.addContainer(containerObj)
          .then(
            function(containerObj) {
              $scope.closeRegisterContainerModal(true);
              var savedContainerObj = null;
              console.log('Returned: ', containerObj);
              $scope.addContainer()(containerObj);
              return containerObj;
            },
            function(response) {
              $scope.setContainerEditError(
                'The webservice encountered an error trying to create this ' +
                'container, please ensure that the container attributes are ' +
                'valid and the same image has not already been registered.',
                '[' + response.status + '] ' + response.statusText
              );
              return $q.reject(response);
            }
          ).finally(function(response) {
            $scope.savingActive = false;
          });
      };

      $scope.getImageName = function(imageUrl, part) {
        var imageUrlRegexp = /^(https?:)?\/\/(www\.)?(quay\.io\/repository|hub\.docker\.com\/r)(\/([\w-]+))+\/([\w-]+)\/?$/i;
        var matchObj = imageUrl.match(imageUrlRegexp);
        var imageName = '';
        if (matchObj && matchObj.length > 2) {
          imageName = (part !== 'name') ? matchObj[5] : matchObj[6];
        }
        return imageName;
      };

      $scope.getContainerRegistry = function(imageUrl) {
        var registry = '';
        if (imageUrl.indexOf('quay.io') !== -1) {
          registry = 'QUAY_IO';
        } else if (imageUrl.indexOf('hub.docker.com') !== -1) {
          registry = 'DOCKER_HUB';
        }
        return registry;
      };

      $scope.getNormalizedContainerObj = function(containerObj) {
        return {
          mode: 'MANUAL_IMAGE_PATH',
          name: $scope.getImageName(containerObj.imageUrl, 'name'),
          toolname: containerObj.toolname,
          namespace: $scope.getImageName(containerObj.imageUrl, 'namespace'),
          registry: $scope.getContainerRegistry(containerObj.imageUrl),
          gitUrl: containerObj.gitUrl,
          default_dockerfile_path: containerObj.default_dockerfile_path,
          default_cwl_path: containerObj.default_cwl_path,
          is_public: containerObj.is_public,
          is_registered: containerObj.is_registered
        };
      };

      $scope.closeRegisterContainerModal = function(toggle) {console.log('emit!');
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

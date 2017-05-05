/*
 *    Copyright 2016 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

'use strict';

/**
 * @ngdoc controller
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
    'FormattingService',
    function($scope, $q, ContainerService, FrmttSrvc) {

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
          case 'GitLab':
            gitUrl = 'https://gitlab.com/';
            break;
          case 'Bitbucket':
            /* falls through */
          default:
            gitUrl = 'https://bitbucket.org/';
        }
        gitUrl += gitPath;
        return gitUrl;
      };

      /**
       * Given an image path and a part, returns the part of the path
       * @param {string} image path, excluding registry (ex. namespace/name)
       * @param {string} part of image (ex. name, namespace)
       * @returns Specified section of the image path
       */
      $scope.getImagePath = function(imagePath, part) {
        /** Defines the regex that an image path (namespace/name) must match.
         Group 1 = namespace, Group 2 = name*/
        var imagePathRegexp = /^(([a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*)|_)\/([a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*)$/i;
        var matchObj = imagePath.match(imagePathRegexp);
        var imageName = '';
        if (matchObj && matchObj.length > 2) {
          imageName = (part !== 'name') ? matchObj[1] : matchObj[4];
        }
        return imageName;
      };

      /**
       * Given a friendly name of a registry, determine the enum
       * @param {string} friendly name of docker registry
       * @returns the docker path of a registry
       */
      $scope.getContainerRegistry = function(irProvider) {
        for (var i = 0; i < $scope.dockerRegistryMap.length; i++) {
          if (irProvider === $scope.dockerRegistryMap[i].friendlyName) {
            return $scope.dockerRegistryMap[i].enum;
          }
        }
      };



      /**
       * Given a friendly name of a registry, determine the docker path
       * @param {string} friendly name of docker registry
       * @returns the docker path of a registry
       */
      $scope.getImageRegistryPath = function(irProvider) {
        for (var i = 0; i < $scope.dockerRegistryMap.length; i++) {
          if (irProvider === $scope.dockerRegistryMap[i].friendlyName) {
            return $scope.dockerRegistryMap[i].dockerPath;
          }
        }
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
          default_wdl_path: containerObj.default_wdl_path,
          default_cwl_test_parameter_file: containerObj.default_cwl_test_parameter_file,
          default_wdl_test_parameter_file: containerObj.default_wdl_test_parameter_file,
          is_published: containerObj.is_published,
          private_access: containerObj.private_access,
          tool_maintainer_email: containerObj.tool_maintainer_email,
          path: $scope.createPath()
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

      /**
       * @ngdoc function
       * @name ngOnInit
       * @description Similar to ngOnInit of Angular 2+
       */
      $scope.ngOnInit = function() {
        $scope.dockerRegistryMap = {};
        $scope.customDockerRegistryPath = null;
        $scope.showCustomDockerRegistryPath = false;
        $scope.setContainerEditError(null);
        FrmttSrvc.getAndReturnDockerRegistryList().then(function(response) {
          $scope.dockerRegistryMap = response;
        });
      };
      $scope.ngOnInit();

      /**
       * Will create a path for the given tool, properly setting the docker registry path
       * @returns path on the tool
       */
      $scope.createPath = function() {
        var path = "";
        if ($scope.customDockerRegistryPath !== null) {
          path += $scope.customDockerRegistryPath;
        } else {
          path += $scope.getImageRegistryPath($scope.containerObj.irProvider);
        }
        path += "/" + $scope.getImagePath($scope.containerObj.imagePath, 'namespace') + "/" + $scope.getImagePath($scope.containerObj.imagePath, 'name');
        return path;
      };

      /**
       * Will customize the form for registering a tool based on the Docker registry chosen
       * @returns nothing
       */
      $scope.checkForSpecialDockerRegistry = function() {
        for (var i = 0; i < $scope.dockerRegistryMap.length; i++) {
          if ($scope.containerObj.irProvider === $scope.dockerRegistryMap[i].friendlyName) {
            if ($scope.dockerRegistryMap[i].privateOnly === "true") {
              $scope.containerObj.private_access = true;
              $("#privateTool").attr('disabled', 'disabled');
            } else {
              $("#privateTool").removeAttr('disabled');
            }

            if ($scope.dockerRegistryMap[i].customDockerPath === "true") {
              $scope.showCustomDockerRegistryPath = true;
              $scope.customDockerRegistryPath = null;
            } else {
              $scope.showCustomDockerRegistryPath = false;
              $scope.customDockerRegistryPath = $scope.getImageRegistryPath($scope.containerObj.irProvider);
            }
          }
        }
      };

      /**
       * Basic private tool specific checks
       * @returns True if invalid private tool, False if valid
       */
      $scope.isInvalidPrivateTool = function() {
        return $scope.containerObj.private_access === true && ($scope.containerObj.tool_maintainer_email === null || $scope.containerObj.tool_maintainer_email === '');
      };

      /**
       * Basic custom docker registry path checks
       * @returns True if invalid custom docker registry, False if valid
       */
      $scope.isInvalidCustomRegistry = function() {
        for (var i = 0; i < $scope.dockerRegistryMap.length; i++) {
          if ($scope.containerObj.irProvider === $scope.dockerRegistryMap[i].friendlyName) {
            if ($scope.dockerRegistryMap[i].privateOnly === "true") {
              if ($scope.customDockerRegistryPath === null || $scope.customDockerRegistryPath === '') {
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }
          }
        }
      };
    }
  ]);

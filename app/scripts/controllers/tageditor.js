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
 * @ngdoc function
 * @name dockstore.ui.controller:TagEditorCtrl
 * @description
 * # TagEditorCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('TagEditorCtrl', [
    '$scope',
    '$q',
    'ContainerService',
    'FormattingService',
    'NotificationService',
    function ($scope, $q, ContainerService, FrmttSrvc, NtfnService) {

      $scope.getHRSize = FrmttSrvc.getHRSize;
      $scope.getDateTimeString = FrmttSrvc.getDateTimeString;

      $scope.saveTagChanges = function() {
        if ($scope.savingActive) return;
        $scope.savingActive = true;
        return ContainerService.updateContainerTag($scope.containerId, $scope.tagObj)
          .then(
            function(versionTags) {
              $scope.closeEditTagModal(true);
              $scope.$emit('tagEditorRefreshContainer', $scope.containerId);
              return versionTags;
            },
            function(response) {
              $scope.setTagEditError(
                'The webservice encountered an error trying to save this ' +
                'container, please ensure that the container exists and the ' +
                'tag attributes are valid.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          ).finally(function(response) {
            $scope.savingActive = false;
          });
      };

      $scope.createTag = function() {
        if ($scope.savingActive) return;
        $scope.savingActive = true;
        var tagObj = $scope.tagObj;
        delete tagObj.create;
        return ContainerService.createContainerTag($scope.containerId, tagObj)
          .then(
            function(versionTags) {
              $scope.closeEditTagModal(true);
              var savedTagObj = null;
              for (var i = 0; i < versionTags.length; i++) {
                if (versionTags[i].name === tagObj.name) {
                  $scope.addVersionTag()(versionTags[i]);
                  break;
                }
              }
              $scope.$emit('tagEditorRefreshContainer', $scope.containerId);
              return versionTags;
            },
            function(response) {
              $scope.setTagEditError(
                'The webservice encountered an error trying to save this ' +
                'container, please ensure that the container exists and the ' +
                'tag attributes are valid.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          ).finally(function(response) {
            $scope.savingActive = false;
          });
      };

      $scope.setDockerPullCmd = function() {
        $scope.dockerPullCmd = FrmttSrvc.getFilteredDockerPullCmd(
          $scope.containerPath,
          $scope.tagObj.name
        );
      };

      $scope.closeEditTagModal = function(toggle) {
        $scope.setTagEditError(null);
        $scope.tagEditorForm.$setUntouched();
        if (toggle) $scope.toggleModal = true;
      };

      $scope.setTagEditError = function(message, errorDetails) {
        if (message) {
          $scope.tagEditError = {
            message: message,
            errorDetails: errorDetails
          };
        } else {
          $scope.tagEditError = null;
        }
      };

      $scope.setTagEditError(null);

  }]);

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
 * @name dockstore.ui.controller:VersionTagEditorCtrl
 * @description
 * # VersionTagEditorCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('VersionTagEditorCtrl', [
    '$scope',
    '$q',
    'WorkflowService',
    'FormattingService',
    'NotificationService',
    function ($scope, $q, WorkflowService, FrmttSrvc, NtfnService) {

      $scope.getDateTimeString = FrmttSrvc.getDateTimeString;
      // Items are the test parameter paths to display
      $scope.items = [];
      // Values in database are the currently stored test parameter paths in the database
      $scope.valuesInDatabase = [];

      // Retrieve test parameter paths from the database and store to items array
      $scope.getTestParameterFiles = function() {
        if ($scope.versionTagObj !== undefined) {
        return WorkflowService.getTestJson($scope.workflowId, $scope.versionTagObj.name)
          .then(
            function(testJson) {
              $scope.items = [];
              for (var i = 0; i < testJson.length; i++) {
                $scope.items.push(testJson[i].path);
              }
              if (testJson.length === 0) {
                $scope.items.push("");
              }
            },
            function(response) {
              return $q.reject(response);
            }
          );
          }
      };

      // Retrieve test parameter paths from the database and store to valuesInDatabase array
      $scope.getDbTestParameterFiles = function() {
        if ($scope.versionTagObj !== undefined) {
        return WorkflowService.getTestJson($scope.workflowId, $scope.versionTagObj.name)
          .then(
            function(testJson) {
              $scope.valuesInDatabase = [];
              for (var i = 0; i < testJson.length; i++) {
                $scope.valuesInDatabase.push(testJson[i].path);
              }
            },
            function(response) {
              return $q.reject(response);
            }
          );
          }
      };

      // Adds a blank text input for a new test parameter file
      $scope.addTestParameterFile = function() {
        if ($scope.items[$scope.items.length - 1] !== "") {
          $scope.items.push("");
        }
      };

      // Removes a text input for a test parameter file
      $scope.removeTestParameterFile = function(index) {
        if (index > -1) {
          $scope.items.splice(index, 1);
        }
        if ($scope.items.length === 0) {
          $scope.items.push("");
        }
      };

      // Updates the database with the new set of test parameter files, removes any that have been deleted
      $scope.updateTestParameterFiles = function() {
        $scope.getDbTestParameterFiles().then(function() {
          while ($scope.items.indexOf("") !== -1) {
            $scope.items.splice($scope.items.indexOf(""), 1);
          }
          var toRemove = [];
          var toAdd = [];
          toRemove = $($scope.valuesInDatabase).not($scope.items);
          toAdd = $scope.items;
          $scope.removeTestParameterFileToDb(toRemove.toArray(), toAdd);
        });
      };

      // Called when user wants to save changes made to the version
      $scope.saveVersionTagChanges = function() {
        if ($scope.savingActive) return;
        $scope.savingActive = true;
        return WorkflowService.updateWorkflowVersionTag($scope.workflowId, $scope.versionTagObj)
          .then(
            function(versionTags) {
              $scope.closeEditVersionTagModal(true);
              $scope.updateTestParameterFiles();
              return versionTags;
            },
            function(response) {
              $scope.setVersionTagEditError(
                'The webservice encountered an error trying to save this ' +
                'workflow, please ensure that the workflow exists and the ' +
                'workflow version attributes are valid.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          ).finally(function(response) {
            $scope.savingActive = false;
          });
      };

      // Closes the modal for editing/viewing the version tag
      $scope.closeEditVersionTagModal = function(toggle) {
        $scope.setVersionTagEditError(null);
        $scope.versionTagEditorForm.$setUntouched();
        if (toggle) $scope.toggleModal = true;
      };

      $scope.setVersionTagEditError = function(message, errorDetails) {
        if (message) {
          $scope.versionTagEditError = {
            message: message,
            errorDetails: errorDetails
          };
        } else {
          $scope.versionTagEditError = null;
        }
      };

      $scope.setVersionTagEditError(null);

      // Initializes items with test parameter files from the version
      $scope.setItems = function() {
        $scope.getTestParameterFiles();
      };

      // Update db with new test parameter files for the given workflow and version
      $scope.addTestParameterFileToDb = function(toAdd) {
        if ($scope.versionTagObj !== undefined) {
        return WorkflowService.addTestJson($scope.workflowId, $scope.versionTagObj.name, toAdd)
          .then(
            function(testParameterFiles) {
              $scope.$emit('versionTagEditorRefreshWorkflow', $scope.workflowId);
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to modify test ' +
                'parameter files for this workflow, please ensure that the ' +
                'test parameter paths are properly-formatted and do not ' +
                'contain prohibited characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
          }
      };

      // Remove from db test parameter files for the given workflow and version
      $scope.removeTestParameterFileToDb = function(toRemove, toAdd) {
        if ($scope.versionTagObj !== undefined) {
        return WorkflowService.removeTestJson($scope.workflowId, $scope.versionTagObj.name, toRemove)
          .then(
            function(testParameterFiles) {
              $scope.addTestParameterFileToDb(toAdd);
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to modify test ' +
                'parameter files for this workflow, please ensure that the ' +
                'test parameter paths are properly-formatted and do not ' +
                'contain prohibited characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
          }
      };

      $scope.hasBlankPath = function() {
        return ($scope.items.indexOf("") !== -1);
      };

  }]);

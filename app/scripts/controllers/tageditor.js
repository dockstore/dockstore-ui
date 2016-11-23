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

      // Items are the test parameter paths to display
      $scope.cwlItems = [];
      $scope.wdlItems = [];
      // Values in database are the currently stored test parameter paths in the database
      $scope.cwlValuesInDatabase = [];
      $scope.wdlValuesInDatabase = [];

      // Retrieve test parameter paths from the database and store to items array
      $scope.getTestParameterFiles = function(type) {
        if ($scope.tagObj !== undefined) {
        return ContainerService.getTestJson($scope.containerId, $scope.tagObj.name, type)
          .then(
            function(testJson) {
              if (type === 'CWL') {
                $scope.cwlItems = [];
                for (var i = 0; i < testJson.length; i++) {
                  $scope.cwlItems.push(testJson[i].path);
                }
              if (testJson.length === 0) {
                $scope.cwlItems.push("");
              }
              } else if (type === 'WDL') {
                $scope.wdlItems = [];
                for (var j = 0; j < testJson.length; j++) {
                  $scope.wdlItems.push(testJson[j].path);
                }
              if (testJson.length === 0) {
                $scope.wdlItems.push("");
              }
              }
            },
            function(response) {
              return $q.reject(response);
            }
          );
          }
      };

      // Retrieve test parameter paths from the database and store to ValuesInDatabase array
      $scope.getDbTestParameterFiles = function(type) {
        if ($scope.tagObj !== undefined) {
        return ContainerService.getTestJson($scope.containerId, $scope.tagObj.name, type)
          .then(
            function(testJson) {
              if (type === 'CWL') {
                $scope.cwlValuesInDatabase = [];
                for (var i = 0; i < testJson.length; i++) {
                  $scope.cwlValuesInDatabase.push(testJson[i].path);
                }
              } else if (type === 'WDL') {
                $scope.wdlValuesInDatabase = [];
                for (var j = 0; j < testJson.length; j++) {
                  $scope.wdlValuesInDatabase.push(testJson[j].path);
                }
              }
            },
            function(response) {
              return $q.reject(response);
            }
          );
          }
      };

      // Adds a blank text input for a new test parameter file
      $scope.addTestParameterFile = function(type) {
        if (type === 'CWL') {
          if ($scope.cwlItems[$scope.cwlItems.length - 1] !== "") {
            $scope.cwlItems.push("");
          }
        } else if (type === 'WDL') {
          if ($scope.wdlItems[$scope.wdlItems.length - 1] !== "") {
            $scope.wdlItems.push("");
          }
        }
      };

      // Removes a text input for a test parameter file
      $scope.removeTestParameterFile = function(index, type) {
        if (type === 'CWL') {
          if (index > -1) {
            $scope.cwlItems.splice(index, 1);
          }
          if ($scope.cwlItems.length === 0) {
            $scope.cwlItems.push("");
          }
        } else if (type === 'WDL') {
          if (index > -1) {
            $scope.wdlItems.splice(index, 1);
          }
          if ($scope.wdlItems.length === 0) {
            $scope.wdlItems.push("");
          }
        }
      };

      // Updates the database with the new set of test parameter files, removes any that have been deleted
      $scope.updateTestParameterFiles = function() {
        $scope.getDbTestParameterFiles('CWL').then(function() {
          $scope.getDbTestParameterFiles('WDL').then(function() {
            // Remove all blanks
            while ($scope.cwlItems.indexOf("") !== -1) {
              $scope.cwlItems.splice($scope.cwlItems.indexOf(""), 1);
            }
            while ($scope.wdlItems.indexOf("") !== -1) {
              $scope.wdlItems.splice($scope.wdlItems.indexOf(""), 1);
            }
            var toRemoveCwl = [];
            var toAddCwl = [];
            var toRemoveWdl = [];
            var toAddWdl = [];

            toRemoveCwl = $($scope.cwlValuesInDatabase).not($scope.cwlItems);
            toAddCwl = $scope.cwlItems;
            toRemoveWdl = $($scope.wdlValuesInDatabase).not($scope.wdlItems);
            toAddWdl = $scope.wdlItems;

            $scope.removeTestParameterFileToDb(toRemoveCwl.toArray(), toAddCwl, 'CWL');
            $scope.removeTestParameterFileToDb(toRemoveWdl.toArray(), toAddWdl, 'WDL');
          });
        });
      };

      $scope.saveTagChanges = function() {
        if ($scope.savingActive) return;
        $scope.savingActive = true;
        return ContainerService.updateContainerTag($scope.containerId, $scope.tagObj)
          .then(
            function(versionTags) {
              $scope.closeEditTagModal(true);
              $scope.updateTestParameterFiles();
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

      // Initializes items with test parameter files from the version
      $scope.setItems = function() {
        $scope.getTestParameterFiles('CWL');
        $scope.getTestParameterFiles('WDL');
      };

      // Update db with new test parameter files for the given tool and version
      $scope.addTestParameterFileToDb = function(toAdd, type) {
        if ($scope.tagObj !== undefined) {
        return ContainerService.addTestJson($scope.containerId, $scope.tagObj.name, toAdd, type)
          .then(
            function(testParameterFiles) {
              // Only refresh after WDL was checked
              if (type === 'WDL') {
                $scope.$emit('tagEditorRefreshContainer', $scope.containerId);
              }
            },
            function(response) {
              $scope.setTagEditError(
                'The webservice encountered an error trying to modify test ' +
                'parameter files for this tool, please ensure that the ' +
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

      // Remove from db test parameter files for the given tool and version
      $scope.removeTestParameterFileToDb = function(toRemove, toAdd, type) {
        if ($scope.tagObj !== undefined) {
        return ContainerService.removeTestJson($scope.containerId, $scope.tagObj.name, toRemove, type)
          .then(
            function(testParameterFiles) {
              $scope.addTestParameterFileToDb(toAdd, type);
            },
            function(response) {
              $scope.setTagEditError(
                'The webservice encountered an error trying to modify test ' +
                'parameter files for this tool, please ensure that the ' +
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

      $scope.hasBlankPath = function(type) {
        if (type === 'CWL') {
          return ($scope.cwlItems.indexOf("") !== -1);
        } else if (type === 'WDL') {
          return ($scope.wdlItems.indexOf("") !== -1);
        }
      };
  }]);

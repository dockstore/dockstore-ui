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
 * @name dockstore.ui.controller:WorkflowDetailsCtrl
 * @description
 * # WorkflowDetailsCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('WorkflowDetailsCtrl', [
    '$scope',
    '$q',
    '$sce',
    'WorkflowService',
    'FormattingService',
    'NotificationService',
    '$location',
    function ($scope, $q, $sce, WorkflowService, FrmttSrvc, NtfnService, $location) {

      $scope.labelsEditMode = false;
      $scope.descriptorEnabled = false;
      $scope.validContent = true;
      $scope.missingWarning = false;
      $scope.invalidClass = false;
      $scope.showEditWorkflowPath = true;
      $scope.showEditDescriptorType = true;
      $scope.showEditTestParameterPath = true;
      $scope.pathExtensions = ['cwl','wdl','yml','yaml'];
      $scope.modeTooltip = $sce.trustAsHtml('Stub: Private workflow only containing basic metadata<br>Full:  Publishable workflow that can contain versions and sourcefiles');

      //there are 6 tabs, and only 1 tab can be active
      //so there are 5 tabs that are not active
      var notActiveTabs = 5;
      if (!$scope.activeTabs) {
        $scope.activeTabs = [true];
        for (var i = 0; i < notActiveTabs; i++) $scope.activeTabs.push(false);
      }

      $scope.checkPage = function(){
        $scope.$broadcast('checkDescPageType');
      };

      $scope.openDAG = function() {
        $scope.$broadcast('checkVersion');
        $scope.$broadcast('refreshFiles');
      };

      $scope.getTools = function() {
        $scope.$broadcast('checkToolVersion');
        $scope.$broadcast('refreshTools');
      };

      $scope.loadWorkflowDetails = function(workflowPath) {
        $scope.setWorkflowDetailsError(null);
        return WorkflowService.getPublishedWorkflowByPath(workflowPath)
          .then(
            function(workflowObj) {
              $scope.workflowObj = workflowObj;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to retrieve this ' +
                'workflow, please ensure that the workflow exists and is ' +
                'published for public access.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.setWorkflowRegistration = function(workflowId, isPublished) {
        $scope.setWorkflowDetailsError(null);
        return WorkflowService.setWorkflowRegistration(workflowId, isPublished)
          .then(
            function(workflowObj) {
              $scope.workflowObj.is_published = workflowObj.is_published;
              $scope.updateWorkflowObj();
              return workflowObj;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to register this ' +
                'workflow, please ensure that the associated ' +
                'descriptor is valid and accessible.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          ).finally(function(response) {
            $scope.workflowEditData.isPublished = $scope.workflowObj.is_published;
          });
      };

      $scope.refreshWorkflow = function(workflowId, activeTabIndex) {
        $scope.setWorkflowDetailsError(null);
        if ($scope.refreshingWorkflow) return;
        $scope.refreshingWorkflow = true;
        return WorkflowService.refreshWorkflow(workflowId)
          .then(
            function(workflowObj) {
              $scope.updateWorkflowObj({
                workflowObj: workflowObj,
                activeTabIndex: activeTabIndex ? activeTabIndex : null
              });
              $scope.updateInfoURLs();
              $scope.$broadcast('refreshFiles');
              return workflowObj;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to refresh this ' +
                'workflow, please ensure that the associated ' +
                'descriptor is valid and accessible.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          ).finally(function(response) {
            $scope.refreshingWorkflow = false;
          });
      };

      $scope.restubWorkflow = function(workflowId, activeTabIndex) {
        $scope.setWorkflowDetailsError(null);
        if ($scope.refreshingWorkflow) return;
        return WorkflowService.restubWorkflow(workflowId)
          .then(
            function(workflowObj) {
              $scope.updateWorkflowObj({
                workflowObj: workflowObj,
                activeTabIndex: activeTabIndex ? activeTabIndex : null
              });
              $scope.updateInfoURLs();
              return workflowObj;
             },
             function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to refresh this ' +
                'workflow, please ensure that the associated ' +
                'descriptor is valid and accessible.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
             }
            );
      };

      $scope.checkContentValid = function(){
        //will print this when the 'Publish' button is clicked
        var message = 'The file is missing some required fields. Please make sure the file has all the required fields. ';
        var missingMessage = 'The missing field(s):';
        if($scope.validContent){
          if($scope.missingContent.length !== 0){
            $scope.missingWarning = true;
          }
          return true;

        } else{
            if($scope.missingContent.length !== 0){
              $scope.missingWarning = false;
              for(var i=0;i<$scope.missingContent.length;i++){
                missingMessage += ' \''+$scope.missingContent[i]+'\'';
                if(i !== $scope.missingContent.length -1){
                  missingMessage+=',';
                }
              }
              if(!$scope.refreshingWorkflow){
                if($scope.workflowObj.descriptorType === 'wdl'){
                  $scope.setWorkflowDetailsError(
                    message+missingMessage +
                    '. Required fields in WDL file: \'task\', \'workflow\', \'call\', \'command\', and \'output\'',''
                  );
                }else{
                  $scope.setWorkflowDetailsError(
                    message+missingMessage +
                    '. Required fields in CWL Workflow file: \'inputs\', \'outputs\', \'class: Workflow\', and \'steps\'',''
                  );
                }
              }
            }

            if($scope.invalidClass){
              //file is invalid because class is commandLineTool instead of Workflow
              $scope.setContainerDetailsError(
                'This CWL file is not a Workflow'+
                '. Required fields in CWL Workflow file: \'inputs\', \'outputs\', \'class: Workflow\', and \'steps\'',''
              );
            }

          return false;
        }
      };

      $scope.setWorkflowLabels = function(workflowId, labels) {
        $scope.setWorkflowDetailsError(null);
        return WorkflowService.setWorkflowLabels(workflowId, labels)
          .then(
            function(workflowObj) {
              $scope.workflowObj.labels = workflowObj.labels;
              $scope.updateWorkflowObj();
              return workflowObj;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to modify labels ' +
                'for this workflow, please ensure that the label list is ' +
                'properly-formatted and does not contain prohibited ' +
                'characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.resetWorkflowEditData = function(workflowObj) {
        var labels = (function(labelObjArray) {
          var labelArray = $scope.getWorkflowLabelStrings(labelObjArray);
          var labels = '';
          for (var i = 0; i < labelArray.length; i++) {
            labels += labelArray[i] + ((i !== labelArray.length - 1) ? ', ' : '');
          }
          return labels;
        })(workflowObj.labels);

        $scope.workflowEditData = {
          labels: labels,
          is_published: workflowObj.is_published
        };
      };

      $scope.setWorkflowDetailsError = function(message, errorDetails) {
        if (message) {
          $scope.workflowDetailsError = {
            message: message,
            errorDetails: errorDetails
          };
        } else {
          $scope.workflowDetailsError = null;
        }
      };

      $scope.getTimeAgo = function(timestamp, timeConversion) {
        var timeDiff = (new Date()).getTime() - timestamp;
        return Math.floor(timeDiff / timeConversion);
      };

      $scope.getTimeAgoString = function(timestamp) {
        var msToDays = 1000 * 60 * 60 * 24;
        var msToHours = 1000 * 60 * 60;
        var msToMins = 1000 * 60;

        var timeAgo = $scope.getTimeAgo(timestamp, msToDays);
        if (timeAgo < 1){
          timeAgo = $scope.getTimeAgo(timestamp, msToHours);
          if (timeAgo < 1) {
            timeAgo = $scope.getTimeAgo(timestamp, msToMins);
            if (timeAgo === 0) {
              return '<1 minute ago';
            } else {
              return timeAgo.toString() +
                    ((timeAgo === 1) ? ' minute ago' : ' minutes ago');
            }
          } else {
            return timeAgo.toString() +
                  ((timeAgo === 1) ? ' hour ago' : ' hours ago');
          }
        } else {
          return timeAgo.toString() +
                ((timeAgo === 1) ? ' day ago' : ' days ago');
        }
      };

      $scope.getGitReposProvider = FrmttSrvc.getGitReposProvider;
      $scope.getGitReposProviderName = FrmttSrvc.getGitReposProviderName;
      $scope.getGitReposWebUrlFromPath = FrmttSrvc.getGitReposWebUrlFromPath;

      $scope.updateInfoURLs = function() {
        /* Git Repository */
        $scope.gitReposProvider = $scope.getGitReposProvider(
            $scope.workflowObj.gitUrl);
        $scope.gitReposProviderName = $scope.getGitReposProviderName(
            $scope.gitReposProvider);
        $scope.gitReposWebUrlFromPath = $scope.getGitReposWebUrlFromPath(
            $scope.workflowObj.organization,
            $scope.workflowObj.repository,
            $scope.gitReposProvider);
      };

      $scope.getDateTimeString = FrmttSrvc.getDateTimeString;

      $scope.getWorkflowLabelStrings = function(labels) {
        var sortedLabels = labels.sort(function(a, b) {
          if (a.value < b.value) return -1;
          if (a.value > b.value) return 1;
          return 0;
        });
        var labelStrings = [];
        for (var i = 0; i < sortedLabels.length; i++) {
            labelStrings.push(sortedLabels[i].value);
        }
        return labelStrings;
      };

      $scope.checkOverflow = function() {

        if ($('#label-values')[0].scrollHeight > $('#label-holder').height()) {
           return true;
        } else {
          return false;
        }
      };

       $scope.moveToStart = function(element) {
         $('#label-button-holder').insertBefore($('#' + element));

       };

      $scope.selectLabelTab = function() {
       for (var i = 0; i < notActiveTabs; i++) $scope.activeTabs[i] = false;
       $scope.activeTabs[1] = true;
      };

      $scope.toggleLabelsEditMode = function() {
        $scope.labelsEditMode = !$scope.labelsEditMode;
      };

      $scope.submitWorkflowPathEdits = function(){
        if($scope.workflowObj.workflow_path !== 'undefined'){
          //get the extension of the workflow path and check if it's within the extensions array
          $scope.checkExtension($scope.workflowObj.workflow_path, 'path');
          $scope.updateWorkflowAndVersions();
        }
      };

      $scope.submitTestParameterPathEdits = function(){
        if($scope.workflowObj.default_test_parameter_file !== 'undefined'){
          $scope.updateWorkflowAndVersions();
        }
      };

      $scope.submitDescriptorEdit = function() {
        //check and change path if required
        $scope.checkExtension($scope.workflowObj.workflow_path, 'dropdown');

        //change on the webservice
        $scope.setDescriptorType($scope.workflowObj.id)
          .then(
            function(workflowObj){
              $scope.updateWorkflowPathVersion($scope.workflowObj.id)
              .then(function(workflowObj) {
                $scope.refreshWorkflow($scope.workflowObj.id,0);
              });
            });
      };

      $scope.updateWorkflowAndVersions = function() {
        $scope.setDefaultWorkflowPath($scope.workflowObj.id)
          .then(function(workflowObj) {
            $scope.updateWorkflowPathVersion($scope.workflowObj.id)
              .then(function(workflowObj) {
                $scope.labelsEditMode = false;
                $scope.refreshWorkflow($scope.workflowObj.id,0);
              });
          });
      };

      $scope.submitWorkflowEdits = function() {
        if (!$scope.labelsEditMode) {
          $scope.labelsEditMode = true;
          return;
        }
        // the edit object should be recreated

        if ($scope.workflowEditData.labels !== 'undefined') {
          $scope.setWorkflowLabels($scope.workflowObj.id,
              $scope.workflowEditData.labels)
            .then(function(workflowObj) {
              $scope.labelsEditMode = false;
            });
        }
      };

      $scope.checkExtension = function(path, type){
        // will never have indexPeriod = -1 because by default save button
        // is disabled when there is no extension provided in workflow path
        // and this function is called only when save button is clicked
        var indexPeriod = path.indexOf('.');
        var ext = path.substring(indexPeriod+1,path.length);
        if($scope.pathExtensions.indexOf(ext) !== -1){
          //extension is one of [cwl,wdl,yaml,yml]
          if(ext !== $scope.workflowObj.descriptorType && type === 'path'){
            //changed made on the path, need to change dropdown
            if(ext !== 'wdl'){
              $scope.workflowObj.descriptorType = 'cwl';
            }else{
              $scope.workflowObj.descriptorType = 'wdl';
            }
          }else if(ext !== $scope.workflowObj.descriptorType && type === 'dropdown'){
            //changes made on the dropdown, need to change the path
            $scope.changeExt(path,$scope.workflowObj.descriptorType);
          }
        }else if(path === ""){
          //path is empty, should by default put "/Dockstore."+descriptorType
           $scope.workflowObj.workflow_path = '/Dockstore.'+$scope.workflowObj.descriptorType;
        }
      };

      $scope.changeExt = function(path, desc){
        var indexPeriod = path.indexOf('.');
        var nameNoExt = path.substring(0,indexPeriod);
        var ext = path.substring(indexPeriod+1,path.length).toLowerCase();
        if(desc === ""){
          //change extension from uppercase to lowercase(not because of changes in dropdown)
          $scope.workflowObj.workflow_path = nameNoExt+'.'+ ext;
          if(ext !== 'wdl'){
            $scope.workflowObj.descriptorType = 'cwl';
          }else{
            $scope.workflowObj.descriptorType = 'wdl';
          }
        }else{
          //change path based on changed on descriptor type
          $scope.workflowObj.workflow_path = nameNoExt+'.'+desc;
        }
      };

      $scope.setDefaultWorkflowPath = function(workflowId){
        return WorkflowService.updateWorkflowDefaults(workflowId, $scope.workflowObj)
          .then(
            function(workflowObj){
              $scope.workflowObj.workflow_path = workflowObj.workflow_path;
              $scope.updateWorkflowObj();
              return workflowObj;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to modify default path ' +
                'for this workflow, please ensure that the path is valid, ' +
                'properly-formatted and does not contain prohibited ' +
                'characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.setDefaultTestParameterPath = function(workflowId){
        return WorkflowService.updateWorkflowDefaults(workflowId, $scope.workflowObj)
          .then(
            function(workflowObj){
              $scope.workflowObj.default_test_parameter_file = workflowObj.default_test_parameter_file;
              $scope.updateWorkflowObj();
              return workflowObj;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to modify default path ' +
                'for this workflow, please ensure that the path is valid, ' +
                'properly-formatted and does not contain prohibited ' +
                'characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.setDescriptorType = function(workflowId){
        //we are calling setDefaultWorkflowPath because PUT in this service will also change the descriptor type
        //and required to change the same values as when changing the default path
        return WorkflowService.setDefaultWorkflowPath(workflowId, $scope.workflowObj)
          .then(
            function(workflowObj){
              $scope.workflowObj.descriptorType = workflowObj.descriptorType;
              $scope.updateWorkflowObj();
              return workflowObj;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to modify descriptor type ' +
                'for this workflow.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.updateWorkflowPathVersion = function(workflowId){
        return WorkflowService.updateWorkflowPathVersion(workflowId, $scope.workflowObj)
          .then(
            function(workflowObj){
              $scope.workflowObj.workflow_path = workflowObj.workflow_path;
              $scope.updateWorkflowObj();
              return workflowObj;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to modify default path ' +
                'for this workflow, please ensure that the path is valid, ' +
                'properly-formatted and does not contain prohibited ' +
                'characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.isWorkflowValid = function() {
        if ($scope.workflowObj.is_published) {
          return true;
        }

        var versionTags = $scope.workflowObj.workflowVersions;

        if (versionTags === null) {
          return false;
        }

        for (var i = 0; i < versionTags.length; i++) {
          if (versionTags[i].valid) {
            return true;
          }
        }
        return false;
      };

      $scope.isWorkflowFull = function() {
        if ($scope.workflowObj !== null && $scope.workflowObj.mode === 'FULL') {
          return true;
        }
        return false;
      };

      $scope.$watch('workflowPath', function(newValue, oldValue) {
        if (newValue) {
          $scope.setWorkflowDetailsError(null);
          if (!$scope.editMode) {
            $scope.loadWorkflowDetails($scope.workflowPath)
              .then(function(workflowObj) {
                $scope.updateInfoURLs();
              });
          } else {
            $scope.labelsEditMode = false;
            $scope.resetWorkflowEditData($scope.workflowObj);
            $scope.updateInfoURLs();
          }
        }
      });

      $scope.getRegistry = function(gitUrl) {
        if (gitUrl !== undefined && gitUrl !== null) {
          if (gitUrl.indexOf('github.com') !== -1) {
            return 'GitHub';
          } else if (gitUrl.indexOf('bitbucket.org') !== -1) {
            return 'Bitbucket';
          } else if (gitUrl.indexOf('gitlab.com') !== -1) {
            return 'Gitlab';
          } else {
            return null;
          }
        } else {
          return null;
        }
      };

     $scope.getRepoUrl = function(organization, repository, registry) {
      if (registry !== undefined && registry !== null) {
        if (registry.toLowerCase() === "github") {
          return 'https://github.com/' + organization + '/' + repository;
        } else if (registry.toLowerCase() === "bitbucket") {
          return 'https://bitbucket.org/' + organization + '/' + repository;
        } else if (registry.toLowerCase() === "gitlab") {
          return 'https://gitlab.com/' + organization + '/' + repository;
        } else {
          return null;
        }
      } else {
        return null;
      }
     };

  }]);

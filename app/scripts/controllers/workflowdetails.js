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
    'WorkflowService',
    'FormattingService',
    'NotificationService',
    '$location',
    function ($scope, $q, WorkflowService, FrmttSrvc, NtfnService, $location) {

      $scope.labelsEditMode = false;
      $scope.descriptorEnabled = false;
      $scope.validContent = true;
      $scope.missingWarning = false;
      $scope.invalidClass = false;
      $scope.showEditWorkflowPath = true;
      $scope.showEditDescriptorType = true;
      if (!$scope.activeTabs) {
        $scope.activeTabs = [true];
        for (var i = 0; i < 3; i++) $scope.activeTabs.push(false);
      }

      $scope.checkPage = function(){
        $scope.$broadcast('checkDescPageType');
      };

      $scope.openDAG = function() {
        $scope.$broadcast('refreshFiles');
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

      $scope.checkContentValid = function(){
        //will print this when the 'Publish' button is clicked
        var message = 'The file is missing some required fields. Please make sure the file has all the required fields. ';
        var missingMessage = 'The missing field(s):'
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
                if(i!=$scope.missingContent.length -1){
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

      $scope.setDefaultWorkflowPath = function(workflowId, path){
        return WorkflowService.setDefaultWorkflowPath(workflowId, path, $scope.workflowObj.workflowName, $scope.workflowObj.descriptorType, 
          $scope.workflowObj.path, $scope.workflowObj.gitUrl)
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

      $scope.setDescriptorType = function(workflowId){
        //we are calling setDefaultWorkflowPath because PUT in this service will also change the descriptor type
        //and required to change the same values as when changing the default path
        return WorkflowService.setDefaultWorkflowPath(workflowId, $scope.workflowObj.workflow_path, $scope.workflowObj.workflowName, 
          $scope.workflowObj.descriptorType, $scope.workflowObj.path, $scope.workflowObj.gitUrl)
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

      $scope.getDaysAgo = function(timestamp) {
        var timeDiff = (new Date()).getTime() - timestamp;
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      };

      $scope.getDaysAgoString = function(timestamp) {
        var daysAgo = $scope.getDaysAgo(timestamp);
        if(daysAgo < 0){
          daysAgo = 0;
        }
        return daysAgo.toString() +
                ((daysAgo === 1) ? ' day ago' : ' days ago');
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
       for (var i = 0; i < 4; i++) $scope.activeTabs[i] = false;
       $scope.activeTabs[1] = true;
      };

      $scope.toggleLabelsEditMode = function() {
        $scope.labelsEditMode = !$scope.labelsEditMode;
      };

      $scope.submitWorkflowPathEdits = function(){
        if($scope.workflowObj.workflow_path !== 'undefined'){
          $scope.setDefaultWorkflowPath($scope.workflowObj.id,
            $scope.workflowObj.workflow_path)
          .then(function(workflowObj) {
            $scope.labelsEditMode = false;
          });
        }
      };

      $scope.submitDescriptorEdit = function() {
        $scope.setDescriptorType($scope.workflowObj.id)
          .then(function(workflowObj){console.log("success submit descriptor edit")});
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
        if ($scope.workflowObj.mode === 'FULL') {
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
      if (gitUrl.indexOf('github.com') !== -1) {
          return 'GitHub';
        } else if (gitUrl.indexOf('bitbucket.org') !== -1) {
          return 'Bitbucket';
        } else {
          return null;
        }
      };

     $scope.getRepoUrl = function(organization, repository, registry) {
      if (registry.toLowerCase() === "github") {
          return 'https://github.com/' + organization + '/' + repository;
        } else if (registry.toLowerCase() === "bitbucket") {
          return 'https://bitbucket.org/' + organization + '/' + repository;
        } else {
          return null;
        }
      };

  }]);

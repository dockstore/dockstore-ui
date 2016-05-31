'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:RegisterWorkflowCtrl
 * @description
 * # RegisterWorkflowCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('RegisterWorkflowCtrl', [
    '$scope',
    '$q',
    'WorkflowService',
    function ($scope, $q, WorkflowService) {
      $scope.registerWorkflow = function() {
        $scope.setWorkflowEditError(null);
        var workflowObj = $scope.getNormalizedWorkflowObj($scope.workflowObj);
        $scope.createWorkflow(workflowObj)
          .then(function(workflowObj) {
            $scope.closeRegisterWorkflowModal(true);
            var savedWorkflowObj = null;
            $scope.addWorkflow()(workflowObj);
          });
      };

      $scope.createWorkflow = function(workflowObj) {
        if ($scope.savingActive) return;
        $scope.savingActive = true;
        return WorkflowService.createWorkflow($scope.workflowObj.scrProvider, workflowObj.gitUrl, workflowObj.default_workflow_path, workflowObj.workflowName, $scope.workflowObj.descriptorType)
          .then(
            function(workflowObj) {
              return workflowObj;
            },
            function(response) {
              $scope.setWorkflowEditError(
                'The webservice encountered an error trying to create this ' +
                'workflow, please ensure that the workflow attributes are ' +
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

      $scope.changeExt = function(name, extension){
        // 'name' will be undefined if it does not pass the ng-pattern for ng-model
        // ng-pattern will check if there is an extension or not. If there is, it'll check if the extension is cwl/wdl
        var nameNoExt="";
        var indexPeriod=-1;
        if(name === undefined){
          name = document.getElementById("workflow_path").value;
          indexPeriod = name.indexOf('.');
          if(indexPeriod != -1){ //there is an extension in the filename given, but the filename is invalid
            nameNoExt = name.substring(0,indexPeriod);
            return nameNoExt+'.'+extension;
          }
          return name+'.'+extension;
        }else{
          indexPeriod = name.indexOf('.');
          nameNoExt = name.substring(0,indexPeriod);
          return nameNoExt+'.'+extension;
        }
      };

      $scope.getWorkflowPath = function(workflowPath, part) {
        var path = workflowPath.split("/");
        return (part === 'organization') ? path[0] : path[1];
      };

      $scope.getNormalizedWorkflowObj = function(workflowObj) {
        var normWorkflowObj = {
          mode: 'STUB',
          repository: $scope.getWorkflowPath(workflowObj.gitPath, 'repository'),
          workflowName: workflowObj.workflow_name,
          organization: $scope.getWorkflowPath(workflowObj.gitPath, 'organization'),
          gitUrl: workflowObj.gitPath,
          default_workflow_path: workflowObj.default_workflow_path,
          is_published: workflowObj.is_published,
        };
        return normWorkflowObj;
      };

      $scope.closeRegisterWorkflowModal = function(toggle) {
        $scope.setWorkflowEditError(null);
        $scope.registerWorkflowForm.$setUntouched();
        if (toggle) $scope.toggleModal = true;
      };

      $scope.setWorkflowEditError = function(message, errorDetails) {
        if (message) {
          $scope.workflowEditError = {
            message: message,
            errorDetails: errorDetails
          };
        } else {
          $scope.workflowEditError = null;
        }
      };

      $scope.setWorkflowEditError(null);

  }]);

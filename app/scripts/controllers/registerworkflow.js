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

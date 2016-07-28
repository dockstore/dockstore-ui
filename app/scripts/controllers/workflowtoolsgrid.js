'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:WorkflowToolsGridCtrl
 * @description
 * # WorkflowToolsGridCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('WorkflowToolsGridCtrl', [
    '$scope',
    '$q',
    'WorkflowService',
    'FormattingService',
    'NotificationService',
    function ($scope, $q, WorkflowService, FrmttSrvc, NtfnService) {

      $scope.toolJson = null;
      $scope.successContent = [];
      $scope.toolsContent = [];
      $scope.missingTool = false;

      $scope.getWorkflowVersions = function() {
        var sortedVersionObjs = $scope.workflowObj.workflowVersions;
        sortedVersionObjs.sort(function(a, b) {
          if (a.name === 'master') return -1;
          if ((new RegExp(/[a-zA-Z]/i).test(a.name.slice(0, 1))) &&
                (new RegExp(/[^a-zA-Z]/i).test(b.name.slice(0, 1)))) return -1;
          /* Lexicographic Sorting */
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        var versions = [];
        for (var i = 0; i < sortedVersionObjs.length; i++) {
          if (!sortedVersionObjs[i].hidden) {
            versions.push(sortedVersionObjs[i].name);
          }
        }
        return versions;
      };

      $scope.getTableContent = function(workflowId, workflowVersions) {
        //this function will call the webservice to get 
        //the workflow and tool/task excerpt in form of json
        //and return here as a promise

        var workflowVersionId;
        if(workflowVersions.length === 0){
          return null;
        }

        for(var i=0;i<workflowVersions.length; i++){
          if (workflowVersions[i].name === $scope.selVersionName) {
            if (workflowVersions[i].valid) {
              workflowVersionId = workflowVersions[i].id;
              break;
            } else {
              return null;
            }
          }
        }

        return WorkflowService.getTableToolContent(workflowId, workflowVersionId)
          .then(
            function(toolJson) {
              $scope.toolJson = toolJson;
              return toolJson;
            },
            function(response) {
              return $q.reject(response);
            });
      };

      $scope.checkVersion = function() {
        $scope.successContent = [];
        for(var i=0;i<$scope.workflowObj.workflowVersions.length;i++){
          if($scope.workflowObj.workflowVersions[i].valid){
            $scope.successContent.push($scope.workflowObj.workflowVersions[i].name);
          }
        }
      };

      $scope.filterVersion = function(element) {
        for(var i=0;i<$scope.successContent.length;i++){
          if($scope.successContent[i] === element){
            return true;
          } else{
            if(i===$scope.successContent.length -1){
              return false;
            }
          }
        }
      };

      $scope.setDocument = function() {
        $scope.workflowVersions = $scope.getWorkflowVersions();
        $scope.selVersionName = $scope.successContent[0];

      };

      $scope.refreshDocument = function() {
        $scope.toolsContent = [];
        $scope.toolJson = $scope.getTableContent($scope.workflowObj.id, $scope.workflowObj.workflowVersions);
        if($scope.toolJson !== null){
          $scope.toolJson.then(
            function(s){
              if(s.length === 0){
                $scope.missingTool = true;
              }else{
                for(var i = 0;i<s.length;i++){
                  $scope.toolsContent.push(s[i]);
                }
                $scope.missingTool = false;
              }
            },
            function(e){
              console.log("toolJSON error");
              $scope.missingTool = true;
            }
          );
        }
      };

      $scope.setDocument();

  }]);

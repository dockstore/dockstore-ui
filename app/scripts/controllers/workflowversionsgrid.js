'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:WorkflowVersionsGridCtrl
 * @description
 * # WorkflowVersionsGridCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('WorkflowVersionsGridCtrl', [
    '$scope',
    '$q',
    'WorkflowService',
    'FormattingService',
    'NotificationService',
    function ($scope, $q, WorkflowService, FrmttSrvc, NtfnService) {

      $scope.workflows = [];
      $scope.sortColumn = 'name';
      $scope.sortReverse = false;

      $scope.getDateModified = FrmttSrvc.getDateModified;

      $scope.clickSortColumn = function(columnName) {
        if ($scope.sortColumn === columnName) {
          $scope.sortReverse = !$scope.sortReverse;
        } else {
          $scope.sortColumn = columnName;
          $scope.sortReverse = false;
        }
      };

      $scope.getIconClass = function(columnName) {
        if ($scope.sortColumn === columnName) {
          return !$scope.sortReverse ?
            'glyphicon-sort-by-alphabet' : 'glyphicon-sort-by-alphabet-alt';
        } else {
          return 'glyphicon-sort';
        }
      };

      $scope.addVersionTag = function(tagObj) {
        $scope.versionTags.push(tagObj);
      };

      $scope.updateDefaultVersion = function(referenceName) {
      $scope.workflowObj.defaultValue = referenceName;
        WorkflowService.updateDefaultVersion($scope.workflowObj.id,$scope.workflowObj)
        .then(function(){
          $scope.$parent.refreshWorkflow($scope.workflowObj.id,0);
         });
      };


  }]);

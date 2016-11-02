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
 * @name dockstore.ui.controller:WorkflowVersionsGridCtrl
 * @description
 * # WorkflowVersionsGridCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('WorkflowVersionsGridCtrl', [
    '$scope',
    '$q',
    '$sce',
    'WorkflowService',
    'FormattingService',
    'NotificationService',
    function ($scope, $q, $sce, WorkflowService, FrmttSrvc, NtfnService) {

      $scope.workflows = [];
      $scope.sortColumn = 'name';
      $scope.sortReverse = false;
      $scope.gitReferenceTooltip = $sce.trustAsHtml('Git branches/tags<br/> The selected reference will be used to populate <br/>the info tab including "launch with"');

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

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
 * @ngdoc controller
 * @name dockstore.ui.controller:WorkflowsGridCtrl
 * @description
 * # WorkflowsGridCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('WorkflowsGridCtrl', [
    '$scope',
    '$rootScope',
    'FormattingService',
    'UtilityService',
    'WorkflowService',
    '$filter',
    '$location',
    function ($scope, $rootScope, FrmttSrvc, UtilityService, WorkflowService, $filter, $location) {
      $scope.sortColumn = 'name';
      $scope.sortReverse = false;
      $scope.numContsPage = 10;
      $scope.currPage = 1;
      $scope.contLimit = $scope.previewMode ? 5 : undefined;
      $scope.descriptionLimit = 150;

      $scope.getGitReposProvider = FrmttSrvc.getGitReposProvider;
      $scope.getGitReposProviderName = FrmttSrvc.getGitReposProviderName;
      $scope.getGitReposWebUrlFromPath = FrmttSrvc.getGitReposWebUrlFromPath;
      $scope.getDateModified = FrmttSrvc.getDateModified;

      $scope.hasDescription = function(description) {
        // temporary
        return false;
        // Don't delete - This is used to display a description in the search, but we don't yet want it to show
//        if (description !== undefined && description !== null && description !== '' && $scope.homePage === false) {
//          return 'search-with-description';
//        } else {
//          return '';
//        }
      };

      var organization = '';

      /* Filter by organization */
      var location = $location.search();
      if (location.hasOwnProperty("organization")) {
        organization = location.namespace;
      }

      /* Column Sorting */
      $scope.clickSortColumn = function(columnName) {
        if ($scope.sortColumn === columnName) {
          $scope.sortReverse = !$scope.sortReverse;
        } else {
          $scope.sortColumn = columnName;
          $scope.sortReverse = false;
        }
      };

      $scope.getIconClass = function(columnName) {
        return UtilityService.getIconClass(columnName, $scope.sortColumn, $scope.sortReverse);
      };

      /* Pagination */
      $scope.getFirstPage = function() {
        return UtilityService.getFirstPage();
      };

      $scope.getLastPage = function() {
        return UtilityService.getLastPage($scope.numContsPage, $scope.filteredWorkflows.length);
      };

      $scope.changePage = function(nextPage) {
        $scope.currPage = UtilityService.changePage(nextPage, $scope.currPage, $scope.getFirstPage, $scope.getLastPage);
      };

      $scope.getListRange = function() {
       return UtilityService.getListRange($scope.numContsPage, $scope.currPage, $scope.filteredWorkflows.length);
      };

      $scope.getHumanReadableDescriptor = function(descriptor) {
        return UtilityService.getHumanReadableDescriptor(descriptor);
      };

      $scope.$watch('searchQueryWorkflow', function(term) {
        $scope.filteredWorkflows = $filter('filter')($scope.workflows, term);
        $scope.entryCount = $scope.filteredWorkflows.length;
      });

      $scope.$watch('workflows', function() {
        if (organization) {
          WorkflowService.getPublishedWorkflowByOrganization(location.organization)
            .then(
              function(workflows) {
                $scope.filteredWorkflows = workflows;
              });
        } else {
          $scope.filteredWorkflows = $filter('filter')($scope.workflows, $scope.searchQueryWorkflow);
        }

        $scope.entryCount = $scope.filteredWorkflows.length;
      });

      $scope.isVerified = function(workflow) {
        return UtilityService.isVerifiedWorkflow(workflow);
      };
  }]);

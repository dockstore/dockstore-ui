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
 * @name dockstore.ui.controller:ContainersGridCtrl
 * @description
 * # ContainersGridCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('ContainersGridCtrl', [
    '$scope',
    '$rootScope',
    'FormattingService',
    'UtilityService',
    'ContainerService',
    '$filter',
    '$location',
    function ($scope, $rootScope, FrmttSrvc, UtilityService, ContainerService, $filter, $location) {

      $scope.sortColumn = 'name';
      $scope.sortReverse = false;
      $scope.numContsPage = 10;
      $scope.currPage = 1;
      $scope.contLimit = $scope.previewMode ? 5 : undefined;
      $scope.descriptionLimit = 300;

      $scope.getGitReposProvider = FrmttSrvc.getGitReposProvider;
      $scope.getGitReposProviderName = FrmttSrvc.getGitReposProviderName;
      $scope.getGitReposWebUrl = FrmttSrvc.getGitReposWebUrl;
      $scope.getImageReposProviderName = FrmttSrvc.getImageReposProviderName;
      $scope.getImageReposWebUrl = FrmttSrvc.getImageReposWebUrl;
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

      /* Filter by namespace */
      var location = $location.search();
      if (location.hasOwnProperty("namespace")) {

        ContainerService.getPublishedContainersByNamespace(location.namespace)
          .then(
            function(containers) {
              $scope.filteredTools = containers;
            });
      }

      $scope.getDockerPullCmd = function(path) {
        return FrmttSrvc.getFilteredDockerPullCmd(path);
      };

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
        return UtilityService.getLastPage($scope.numContsPage, $scope.filteredTools.length);
      };

      $scope.changePage = function(nextPage) {
        $scope.currPage = UtilityService.changePage(nextPage, $scope.currPage, $scope.getFirstPage, $scope.getLastPage);
      };

      $scope.getListRange = function() {
        return UtilityService.getListRange($scope.numContsPage, $scope.currPage, $scope.filteredTools.length);
      };

      $scope.$watch('searchQueryContainer', function(term) {
        $scope.filteredTools = $filter('filter')($scope.containers, term);
        if ($scope.filteredTools !== undefined) {
          $scope.entryCount = $scope.filteredTools.length;
        }
      });

      $scope.$watch('containers', function() {
        $scope.filteredTools = $filter('filter')($scope.containers, $scope.searchQueryContainer);
        //console.log(JSON.stringify($scope.filteredTools));
        if ($scope.filteredTools !== undefined) {
          $scope.entryCount = $scope.filteredTools.length;
        }
      });

      $scope.isVerified = function(container) {
        return UtilityService.isVerifiedTool(container);
      };
  }]);

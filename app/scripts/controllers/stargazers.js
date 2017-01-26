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
 * @name dockstore.ui.controller:StarringCtrl
 * @description
 * # StarringCtrl
 * Controller of the dockstore.ui
 */

angular.module('dockstore.ui')
  .controller('StargazersCtrl', [
    '$scope',
    '$q',
    '$auth',
    'UserService',
    'UtilityService',
    '$filter',
    function($scope, $q, $auth, UserService, UtilityService, $filter) {
      $scope.sortColumn = 'name';
      $scope.sortReverse = false;
      $scope.numContsPage = 10;
      $scope.currPage = 1;
      $scope.descriptionLimit = 300;

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

    }
  ]);

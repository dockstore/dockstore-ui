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
 * @name dockstore.ui.controller:TokensGridCtrl
 * @description
 * # TokensGridCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('TokensGridCtrl', [
    '$scope',
    function ($scope) {
      $scope.sortColumn = 'tokenId';
      $scope.sortReverse = false;
      $scope.numTknsPage = 10;
      $scope.currPage = 1;

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
        if ($scope.sortColumn === columnName) {
          return !$scope.sortReverse ?
            'glyphicon-sort-by-alphabet' : 'glyphicon-sort-by-alphabet-alt';
        } else {
          return 'glyphicon-sort';
        }
      };

      $scope.$watch('tokens', function(newVal, oldVal) {
        if (newVal) {
          $scope.tokens = newVal;
        }
      });

  }]);

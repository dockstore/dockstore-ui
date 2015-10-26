'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:VersionsGridCtrl
 * @description
 * # VersionsGridCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('VersionsGridCtrl', [
    '$scope',
    function ($scope) {
      
      $scope.containers = [];
      $scope.sortColumn = 'name';
      $scope.sortReverse = false;

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

  }]);

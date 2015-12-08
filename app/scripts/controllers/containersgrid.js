'use strict';

/**
 * @ngdoc function
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
    function ($scope, $rootScope, FrmttSrvc) {

      $scope.containers = [];
      $scope.sortColumn = 'name';
      $scope.sortReverse = false;
      $scope.numContsPage = 10;
      $scope.currPage = 1;
      $scope.contLimit = $scope.previewMode ? 5 : undefined;

      $scope.getGitReposProvider = FrmttSrvc.getGitReposProvider;
      $scope.getGitReposProviderName = FrmttSrvc.getGitReposProviderName;
      $scope.getGitReposWebUrl = FrmttSrvc.getGitReposWebUrl;
      $scope.getImageReposProvider = FrmttSrvc.getImageReposProvider;
      $scope.getImageReposProviderName = FrmttSrvc.getImageReposProviderName;
      $scope.getImageReposWebUrl = FrmttSrvc.getImageReposWebUrl;

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
        if ($scope.sortColumn === columnName) {
          return !$scope.sortReverse ?
            'glyphicon-sort-by-alphabet' : 'glyphicon-sort-by-alphabet-alt';
        } else {
          return 'glyphicon-sort';
        }
      };

      /* Pagination */
      $scope.getFirstPage = function() {
        return 1;
      };

      $scope.getLastPage = function() {
        return Math.ceil($scope.filteredContainers.length / $scope.numContsPage);
      };

      $scope.changePage = function(nextPage) {
        if (nextPage) {
          /* Next Page*/
          if ($scope.currPage === $scope.getLastPage) return;
          $scope.currPage++;
        } else {
          /* Previous Page*/
          if ($scope.currPage === $scope.getFirstPage) return;
          $scope.currPage--;
        }
      };

      $scope.getListRange = function() {
        return {
          start: Math.min($scope.numContsPage * ($scope.currPage - 1),
                          $scope.filteredContainers.length),
          end: Math.min($scope.numContsPage * $scope.currPage - 1,
                        $scope.filteredContainers.length)
        };
      };

      $scope.getListRangeString = function() {
        var start = Math.min($scope.numContsPage * ($scope.currPage - 1) + 1,
                              $scope.filteredContainers.length).toString();
        var end = Math.min($scope.numContsPage * $scope.currPage,
                              $scope.filteredContainers.length).toString();

        var padLength = Math.max(start.length, end.length);

        for (var i = start.length; i < padLength; i++) {
          start = '0' + start;
        }
        for (var j = end.length; j < padLength; j++) {
          end = '0' + end;
        }

        return start + ' to ' + end + ' of ' + $scope.filteredContainers.length;
      };
      
  }]);

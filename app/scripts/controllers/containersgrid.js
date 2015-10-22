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
    function ($scope) {
      
      $scope.getLatestVersion = function(tags) {
        if (!tags || tags.length === 0) return 'n/a';
        var desc_tags = tags.sort(function(a, b) {
          return b.version.localeCompare(a.version);
        });
        if (desc_tags.length >= 2 && desc_tags[0].version === 'latest') {
          return desc_tags[1].version;
        } else {
          return desc_tags[0].version;
        }
      };

      $scope.getPageNumList = function() {
        if ($scope.containers.length === 0) return [1];

        var pageNumList = [];

        var numPrevRadiable = Math.min($scope.currPage - 1,
                                        $scope.numNavPages - 1);
        var numNextRadiable = Math.min($scope.numPages - $scope.currPage,
                                        $scope.numNavPages - 1);

        var numNext = 0;
        var numPrev = 0;

        if (numNextRadiable < ($scope.numNavPages - 1) / 2) {
          numPrev = numPrevRadiable - numNextRadiable;
        } else {
          numPrev = Math.min(($scope.numNavPages - 1) / 2,
                              $scope.currPage - 1);
        }

        if (numPrevRadiable < ($scope.numNavPages - 1) / 2) {
          numNext = numNextRadiable - numPrevRadiable;
        } else {
          numNext = Math.min(($scope.numNavPages - 1) / 2,
                              $scope.numPages - $scope.currPage);
        }

        for (var i = numPrev; i >= 0; i--) {
          pageNumList.push($scope.currPage - i);
        }
        for (var i = 1; i <= numNext; i++) {
          pageNumList.push($scope.currPage + i);
        }

        return pageNumList;
      };

      $scope.refreshPagination = function() {
        $scope.numPages =
          Math.ceil($scope.containers.length / parseInt($scope.numContsPage));
        $scope.pageNumList = $scope.getPageNumList();
      };

      $scope.getPaginRangeObj = function() {
        var rangeObj = {};
        rangeObj.start = $scope.numContsPage * ($scope.currPage - 1);
        rangeObj.end = ($scope.numContsPage) * $scope.currPage - 1;
        return rangeObj;
      };

      $scope.changePage = function(pageNum) {
        switch (pageNum) {
          case -1:
            $scope.currPage--;
            break;
          case -2:
            $scope.currPage++;
            break;
          default:
            $scope.currPage = pageNum;
        }
      };

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

      (function init() {
        $scope.containers = [];
        $scope.numContsPage = "2";
        $scope.currPage = 1;
        $scope.numNavPages = 5;
        $scope.sortColumn = 'name';
        $scope.sortReverse = false;
      })();

      
  }]);

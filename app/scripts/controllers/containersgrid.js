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

      $scope.containers = [];
      $scope.sortColumn = 'name';
      $scope.sortReverse = false;
      $scope.numContsPage = "20";
      $scope.numNavPages = 5; // Must be an odd number
      $scope.currPage = 1;
      $scope.startCont = 0;
      $scope.endCont = 0;

      $scope.getGitHubURL = function(containerGitUrl) {
        if (containerGitUrl.length <= 0) return;
        var gitHubURLRegexp = /^git@github.com:(.*)\/(.*).git$/i;
        var matchRes = gitHubURLRegexp.exec(containerGitUrl);
        return 'https://github.com/' + matchRes[1] + '/' + matchRes[2];
      };

      $scope.getQuayIOURL = function(containerPath) {
        if (containerPath.length <= 0) return;
        var quayIOPathRegexp = /^quay\.io\/(.*)\/(.*)$/i;
        var matchRes = quayIOPathRegexp.exec(containerPath);
        return 'https://quay.io/repository/' + matchRes[1] + '/' + matchRes[2];
      };

      $scope.getPageNumList = function() {
        if ($scope.filteredContainers.length === 0) return [1];

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

        for (var i = numPrev; i > 0; i--) {
          pageNumList.push($scope.currPage - i);
        }
        pageNumList.push($scope.currPage);
        for (var j = 1; j <= numNext; j++) {
          pageNumList.push($scope.currPage + j);
        }

        return pageNumList;
      };

      $scope.refreshPagination = function() {
        $scope.currPage = 1;
        $scope.numPages =
          Math.ceil($scope.filteredContainers.length /
                      parseInt($scope.numContsPage));
        $scope.pageNumList = $scope.getPageNumList();
      };

      $scope.updateContRange = function() {
        $scope.startCont = $scope.numContsPage * ($scope.currPage - 1);
        $scope.endCont = ($scope.numContsPage) * $scope.currPage - 1;
      };

      $scope.getPaginRangeObj = function() {
        $scope.updateContRange();
        return {
          start: $scope.startCont,
          end: $scope.endCont
        };
      };

      $scope.changePage = function(pageNum) {
        if ($scope.numPages === 0 ) return;
        switch (pageNum) {
          case -1:
            if ($scope.currPage !== 1) $scope.currPage--;
            break;
          case -2:
            if ($scope.currPage !== $scope.numPages) $scope.currPage++;
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

      $scope.getRangeString = function() {
        var start = Math.min($scope.startCont + 1,
                              $scope.filteredContainers.length).toString();
        var end = Math.min($scope.endCont + 1,
                              $scope.filteredContainers.length).toString();

        var numLength = Math.max(start.length, end.length);

        for (var i = start.length; i < numLength; i++) {
          start = '0' + start;
        }
        for (var j = end.length; j < numLength; j++) {
          end = '0' + end;
        }

        return start + ' to ' + end + ' of ' + $scope.filteredContainers.length;
      };
      
  }]);

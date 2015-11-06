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
      $scope.sortColumn = 'version';
      $scope.sortReverse = false;

      $scope.getHRSize = function(size) {
        if (!size) return 'n/a';
        var hrSize = '';
        var exp = Math.log(size) / Math.log(2);
        if (exp < 10) {
          hrSize = size.toFixed(2) + ' bytes';
        } else if (exp < 20) {
          hrSize = (size / Math.pow(2, 10)).toFixed(2) + ' kB';
        } else if (exp < 30) {
          hrSize = (size / Math.pow(2, 20)).toFixed(2) + ' MB';
        } else if (exp < 40) {
          hrSize = (size / Math.pow(2, 30)).toFixed(2) + ' GB';
        }
        return hrSize;
      };

      $scope.getDateModified = function(timestamp) {
        if (!timestamp) return 'n/a';
        var moy = ['Jan.', 'Feb.', 'Mar.', 'Apr.',
                    'May', 'Jun.', 'Jul.', 'Aug.',
                    'Sept.', 'Oct.', 'Nov.', 'Dec.'];
        var dateObj = new Date(timestamp);
        return moy[dateObj.getMonth()] + ' ' +
                dateObj.getDate() + ', ' +
                dateObj.getFullYear();
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

  }]);

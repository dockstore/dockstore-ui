'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:SearchContainerDetailsCtrl
 * @description
 * # SearchContainerDetailsCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('SearchContainerDetailsCtrl', [
    '$scope',
    '$routeParams',
    function ($scope, $routeParams) {
      
      $scope.containerPath = $routeParams.containerPath;
      $scope.containerObj = null;

  }]);

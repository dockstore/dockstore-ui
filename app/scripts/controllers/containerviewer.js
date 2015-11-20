'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:ContainerViewerCtrl
 * @description
 * # ContainerViewerCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('ContainerViewerCtrl', [
    '$scope',
    '$routeParams',
    function ($scope, $routeParams) {

      $scope.containerPath = $routeParams.containerPath;
      $scope.containerObj = null;

  }]);

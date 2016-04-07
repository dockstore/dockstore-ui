'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:WorkflowViewerCtrl
 * @description
 * # WorkflowViewerCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('WorkflowViewerCtrl', [
    '$scope',
    '$routeParams',
    function ($scope, $routeParams) {

      $scope.workflowPath = $routeParams.workflowPath;
      $scope.workflowObj = null;

  }]);

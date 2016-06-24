'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:workflowToolsGrid
 * @description
 * # workflowToolsGrid
 */
angular.module('dockstore.ui')
  .directive('workflowToolsGrid', function () {
    return {
      restrict: 'AE',
      controller: 'WorkflowToolsGridCtrl',
      controllerAs: 'WorkflowToolsGrid',
      scope: {
      	workflowObj: '=',
      },
      templateUrl: 'templates/workflowtoolsgrid.html',
      link: function postLink(scope, element, attrs) {
        scope.$watch('workflowObj.path', function(newValue, oldValue) {
          if (newValue) scope.setDocument();
        });
        scope.$watchGroup(
          ['selVersionName', 'workflowObj.id'],
          function(newValues, oldValues) {
              scope.setDocument();
        });
        scope.$on('refreshFiles', function(event) {
          scope.setDocument();
        });
      }
    };
  });

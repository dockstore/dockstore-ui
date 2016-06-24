'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:workflowDagView
 * @description
 * # workflowDagView
 */
angular.module('dockstore.ui')
  .directive('workflowDagView', function () {
    return {
      restrict: 'AE',
      controller: 'WorkflowDagViewCtrl',
      scope: {
      	workflowObj: '=',
      },
      templateUrl: 'templates/workflowdagview.html',
      link: function postLink(scope, element, attrs) {
        scope.$watch('workflowObj.path', function(newValue, oldValue) {
          if (newValue) scope.setDocument();
        });
        scope.$watchGroup(
          ['selVersionName', 'workflowObj.id'],
          function(newValues, oldValues) {
              scope.refreshDocument();
        });
        scope.$on('refreshFiles', function(event) {
          scope.setDocument();
          scope.refreshDocument();
        });

      }
    };
  });

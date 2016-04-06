'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:workflowFileViewer
 * @description
 * # workflowFileViewer
 */
angular.module('dockstore.ui')
  .directive('workflowFileViewer', function () {
    return {
      restrict: 'AE',
      controller: 'WorkflowFileViewerCtrl',
      scope: {
        type: '@',
        workflowObj: '=',
        isEnabled: '='
      },
      templateUrl: 'templates/workflowfileviewer.html',
      link: function postLink(scope, element, attrs) {
        scope.$watch('workflowObj.path', function(newValue, oldValue) {
          if (newValue) scope.setDocument();
        });
        scope.$watchGroup(
          ['selVersionName', 'workflowObj.id', 'selDescriptorName'],
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

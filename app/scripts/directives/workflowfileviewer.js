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
          if (newValue) {
            scope.setDocument();
            scope.checkDescriptor();
          }
        });
        scope.$on('refreshFiles', function(event) {
          scope.setDocument();
          scope.refreshDocument();
        });
        scope.$on('checkDescPageType', function(event) {
          scope.checkDescriptor();
        });
        scope.$watchGroup(
          ['selVersionName','descriptor'],
          function(newValues, oldValues) {
            scope.refreshDocumentType();
          });
        scope.$watchGroup(
          ['workflowObj.id', 'selSecondaryDescriptorName'],
          function(newValues, oldValues) {
            scope.refreshDocument();
          });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:containerFileViewer
 * @description
 * # containerFileViewer
 */
angular.module('dockstore.ui')
  .directive('containerFileViewer', function () {
    return {
      restrict: 'AE',
      controller: 'ContainerFileViewerCtrl',
      scope: {
        type: '@',
        containerObj: '=',
        isEnabled: '='
      },
      templateUrl: 'templates/containerfileviewer.html',
      link: function postLink(scope) {
        scope.$watch('containerObj.path', function(newValue) {
          if (newValue) {
            console.log("changed containerObj path");
            scope.setDocument();
            scope.checkDescriptor();
            scope.checkDockerfile();
          }
        });
        scope.$on('refreshFiles', function() {
          scope.setDocument();
          scope.refreshDocument();
          scope.checkDescriptor();
        });
        scope.$on('checkDescPageType', function() {
          scope.checkDescriptor();
        });
        scope.$on('dockerfileTab', function(){
          scope.checkDockerfile();
        });
        scope.$watchGroup(
          ['selTagName', 'selDescriptorName'],
          function() {
            scope.refreshDocumentType();
          });
        scope.$watchGroup(
          ['containerObj.id', 'selSecondaryDescriptorName'],
          function() {
            scope.refreshDocument();
          });
      }
    };
  });

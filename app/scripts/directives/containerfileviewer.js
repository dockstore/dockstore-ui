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
        enabled: '='
      },
      templateUrl: 'templates/containerfileviewer.html',
      link: function postLink(scope, element, attrs) {
        scope.$watch('containerObj.path', function(newValue, oldValue) {console.log('new document!');
          if (newValue) scope.setDocument();
        });
        scope.$watchGroup(
          ['selTagName', 'enabled', 'containerObj.id'],
          function(newValues, oldValues) {console.log('nv', newValues);
            if (newValues[1]) scope.refreshDocument();
        });
      }
    };
  });

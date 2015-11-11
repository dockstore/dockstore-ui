'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:containerDetails
 * @description
 * # containerDetails
 */
angular.module('dockstore.ui')
  .directive('containerDetails', function () {
    return {
      restrict: 'AE',
      controller: 'ContainerDetailsCtrl',
      scope: {
        containerId: '=',
        containerObj: '=',
        editMode: '=',
        updateContainerObj: '&'
      },
      templateUrl: 'templates/containerdetails.html',
      link: function postLink(scope, element, attrs) {
        scope.$watch('containerId',
          function(newVal, oldVal, scope) {
            if (newVal) {
              if ($('[select="loadDockerFile()"]').hasClass('active')) {
                scope.loadDockerFile();
              }
              if ($('[select="loadWFDescriptorFile()"]').hasClass('active')) {
                scope.loadWFDescriptorFile();
              }
            }
        });
      }
    };
  });

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
        containerPath: '=',
        containerObj: '=',
        editMode: '=',
        updateContainerObj: '&'
      },
      templateUrl: 'templates/containerdetails.html',
      link: function postLink(scope, element, attrs) {
        scope.$watch('containerObj',
          function(newVal, oldVal, scope) {
            if (newVal) {
              scope.dockerFileLoaded = false;
              scope.dockerFileString = false;
              scope.wfDescriptorFileLoaded = false;
              scope.wfDescriptorFileString = false;
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

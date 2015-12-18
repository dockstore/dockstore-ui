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
        activeTabs: '=',
        updateContainerObj: '&'
      },
      templateUrl: 'templates/containerdetails.html',
      link: function postLink(scope, element, attrs) {
        scope.$on('tagEditorRefreshContainer', function(event, containerId) {
          console.log('Received `tagEditorRefreshContainer` event, containerId:', containerId);
          scope.refreshContainer(containerId, 2);
        });
      }
    };
  });

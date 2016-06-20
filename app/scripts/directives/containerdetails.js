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
        containerToolname: '=',
        containerObj: '=',
        editMode: '=',
        activeTabs: '=',
        updateContainerObj: '&'
      },
      templateUrl: 'templates/containerdetails.html',
      link: function postLink(scope, element, attrs) {
        scope.$on('tagEditorRefreshContainer', function(event, containerId) {
          scope.refreshContainer(containerId, 2);
        });
        scope.$on('returnValid', function(event, valid){
          scope.validContent = valid;
          scope.checkContentValid();
        });
        scope.$on('returnMissing', function(event,missing){
          scope.missingContent = missing;
        });
        scope.$on('invalidClass', function(event, invalid){
          scope.invalidClass = invalid;
        });
      }
    };
  });
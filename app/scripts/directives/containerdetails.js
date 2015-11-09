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
      templateUrl: 'templates/containerdetails.html'
    };
  });

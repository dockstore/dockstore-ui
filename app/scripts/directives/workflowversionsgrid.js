'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:workflowVersionsGrid
 * @description
 * # workflowVersionsGrid
 */
angular.module('dockstore.ui')
  .directive('workflowVersionsGrid', function () {
    return {
      restrict: 'AE',
      controller: 'WorkflowVersionsGridCtrl',
      controllerAs: 'WorkflowVersionsGrid',
      scope: {
      	workflowObj: '=',
        editMode: '=',
        setError: '='
      },
      templateUrl: 'templates/workflowversionsgrid.html',
      link: function postLink(scope, element, attrs) {
        scope.$watch('workflowObj',
          function(newVal, oldVal, scope) {
            if (newVal) {
              scope.versionTags = scope.workflowObj.workflowVersions;
            }
        }, true);
      }
    };
  });

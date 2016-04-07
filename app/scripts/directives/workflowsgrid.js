'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:workflowsGrid
 * @description
 * # workflowsGrid
 */
angular.module('dockstore.ui')
  .directive('workflowsGrid', function () {
    return {
      restrict: 'AE',
      controller: 'WorkflowsGridCtrl',
      scope: {
        workflows: '=',
        previewMode: '=',
        searchQueryWorkflow: '='
      },
      templateUrl: 'templates/workflowsgrid.html',
      link: function postLink(scope, element, attrs) {
        scope.$watchCollection('filteredWorkflows',
          function(newVal, oldVal, scope) {
            if (newVal) {
              scope.currPage = 1;
            }
        });
      }
    };
  });

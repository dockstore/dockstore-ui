'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:registerWorkflow
 * @description
 * # registerWorkflow
 */
angular.module('dockstore.ui')
  .directive('registerWorkflow', function () {
    return {
      restrict: 'AE',
      controller: 'RegisterWorkflowCtrl',
      scope: {
        workflowObj: '=',
        addWorkflow: '&'
      },
      templateUrl: 'templates/registerworkflow.html',
      link: function postLink(scope, element, attrs) {
        /* Watch for changes to the workflow being edited */
        $('#registerWorkflowModal').on('hidden.bs.modal', function(event) {
          scope.closeRegisterWorkflowModal(false);
        });
        scope.$watch('workflowObj', function(newValue, oldValue, scope) {
          if (newValue) {
            scope.workflowObj.gitPath = scope.workflowObj.organization ?
              scope.workflowObj.organization + '/' + 'new_workflow' : '';
            $(element).find('[data-toggle="tooltip"]').tooltip();
          }
        });
        scope.$watch('toggleModal', function(newValue, oldValue) {
          if (scope.toggleModal) {
            $('#registerWorkflowModal').modal('toggle');
            scope.toggleModal = false;
          }
        });
      }
    };
  });

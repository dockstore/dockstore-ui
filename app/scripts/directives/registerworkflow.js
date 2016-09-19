/*
 *    Copyright 2016 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

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

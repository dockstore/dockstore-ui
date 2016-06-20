'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:workflowDetails
 * @description
 * # workflowDetails
 */
angular.module('dockstore.ui')
  .directive('workflowDetails', function () {
    return {
      restrict: 'AE',
      controller: 'WorkflowDetailsCtrl',
      scope: {
        workflowPath: '=',
        workflowWorkflowname: '=',
        workflowObj: '=',
        editMode: '=',
        activeTabs: '=',
        updateWorkflowObj: '&'
      },
      templateUrl: 'templates/workflowdetails.html',
      link: function postLink(scope, element, attrs) {
        scope.$on('versionTagEditorRefreshWorkflow', function(event, workflowId) {
          scope.refreshWorkflow(workflowId, 2);
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
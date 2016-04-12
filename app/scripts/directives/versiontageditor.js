'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:versionTagEditor
 * @description
 * # versionTagEditor
 */
angular.module('dockstore.ui')
  .directive('versionTagEditor', function () {
    return {
      restrict: 'AE',
      controller: 'VersionTagEditorCtrl',
      scope: {
      	versionTagObj: '=',
        workflowId: '@',
      	workflowPath: '@',
      	editMode: '=',
        addVersionTag: '&'
      },
      templateUrl: 'templates/versiontageditor.html',
      link: function postLink(scope, element, attrs) {
        /* Watch for changes to the tag being edited */
        $('#versionTagEditorModal').on('hidden.bs.modal', function(event) {
          scope.closeEditVersionTagModal(false);
        });
        scope.$watch('toggleModal', function(newValue, oldValue) {
          if (scope.toggleModal) {
            $('#versionTagEditorModal').modal('toggle');
            scope.toggleModal = false;
          }
        });
      }
    };
  });

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
        scope.$watch('versionTagObj.name', function(newValue, oldValue) {
          if (newValue !== undefined) {
            scope.setItems();
          }
        });
      }
    };
  });

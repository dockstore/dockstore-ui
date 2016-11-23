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
 * @name dockstore.ui.directive:tagEditor
 * @description
 * # tagEditor
 */
angular.module('dockstore.ui')
  .directive('tagEditor', function () {
    return {
      restrict: 'AE',
      controller: 'TagEditorCtrl',
      scope: {
      	tagObj: '=',
        containerId: '@',
      	containerPath: '@',
      	editMode: '=',
        addVersionTag: '&'
      },
      templateUrl: 'templates/tageditor.html',
      link: function postLink(scope, element, attrs) {
        /* Watch for changes to the tag being edited */
        $('#tagEditorModal').on('hidden.bs.modal', function(event) {
          scope.closeEditTagModal(false);
        });
        scope.$watch('toggleModal', function(newValue, oldValue) {
          if (scope.toggleModal) {
            $('#tagEditorModal').modal('toggle');
            scope.toggleModal = false;
          }
        });
        scope.$watch('tagObj', function(newValue, oldValue) {
          if (newValue) {
            scope.setDockerPullCmd();
            $(element).find('[data-toggle="tooltip"]').tooltip();
          }
        });
        scope.$watch('tagObj.name', function(newValue, oldValue) {
          if (newValue !== undefined) {
            scope.setItems();
          }
        });
      }
    };
  });

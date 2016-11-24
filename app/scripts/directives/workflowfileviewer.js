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
 * @name dockstore.ui.directive:workflowFileViewer
 * @description
 * # workflowFileViewer
 */
angular.module('dockstore.ui')
  .directive('workflowFileViewer', function () {
    return {
      restrict: 'AE',
      controller: 'WorkflowFileViewerCtrl',
      scope: {
        type: '=',
        workflowObj: '=',
        isEnabled: '=',
        tabindex: '='
      },
      templateUrl: 'templates/workflowfileviewer.html',
      link: function postLink(scope, element, attrs) {
        scope.$on('refreshFiles', function(event) {
          scope.setDocument();
          scope.refreshDocument(false);
          scope.checkDescriptor();
        });
        scope.$on('checkDescPageType', function(event) {
          scope.refreshDocument(false);
          scope.checkDescriptor();
        });
        // If the workflowObj changes, reset to selecting the descriptor tab
        scope.$watchGroup(
          ['workflowObj'],
          function() {
              scope.setType('descriptor');
              scope.setDocument();
              scope.checkDescriptor();
              scope.refreshDocument(false);
          });
        // If the selected version or descriptor type changes, reload the file list and select the first file
        scope.$watchGroup(
          ['selVersionName','descriptor'],
          function(newValues, oldValues) {
            scope.refreshDocument(true);
          });
        // If the selected file tab changes, select the first version, reload file list and select first
        scope.$watchGroup(
          ['type'],
          function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
              scope.selVersionName = scope.filteredVersions[0];
              scope.refreshDocument(true);
            }
          });
        // If a new file name is selected, load it
        scope.$watchGroup(
          ['selFileName'],
          function(newValues, oldValues) {
            scope.refreshDocument(false);
          });
      }
    };
  });

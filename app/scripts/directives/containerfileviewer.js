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
 * @name dockstore.ui.directive:containerFileViewer
 * @description
 * # containerFileViewer
 */
angular.module('dockstore.ui')
  .directive('containerFileViewer', function () {
    return {
      restrict: 'AE',
      controller: 'ContainerFileViewerCtrl',
      scope: {
        type: '=',
        containerObj: '=',
        isEnabled: '='
      },
      templateUrl: 'templates/containerfileviewer.html',
      link: function postLink(scope) {
        // call on refresh
        scope.$on('refreshFiles', function() {
          scope.setDocument();
          scope.refreshDocument(false, false, false);
          scope.checkDescriptor();
        });

        // Call on refresh to check if tool is valid
        scope.$on('checkDescPageType', function() {
          scope.refreshDocument(false, false, false);
          scope.checkDescriptor();
          scope.checkDockerfile();
        });

        // Call when the selected descriptor type changes to pull the correct file
        scope.$watchGroup(
          ['selDescriptorName'],
          function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
              scope.refreshDocument(false, false, true);
            }
          });

        // Call when the selected tag name changes to pull the correct file
        scope.$watchGroup(
          ['selTagName'],
          function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
              scope.refreshDocument(false, true, true);
            }
          });
        // Call when the selected file changes to pull the correct file
        scope.$watchGroup(
          ['selFileName'],
          function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
              scope.refreshDocument(false, false, false);
            }
          });

        // Call when the type of tab changes (dockerfile, descriptor files, and test parameter files)
        scope.$watchGroup(
          ['type'],
          function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
              scope.refreshDocument(true, true, true);
            }
          });

        // Call when the selected tool changes to reinitialize the tab
        scope.$watchGroup(
          ['containerObj'],
          function() {
            scope.setType('dockerfile');
            scope.setDocument();
            scope.checkDescriptor();
            scope.checkDockerfile();
            scope.refreshDocument(false, false, false);
          });
      }
    };
  });

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

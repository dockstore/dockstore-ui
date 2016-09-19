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
 * @name dockstore.ui.directive:containerDetails
 * @description
 * # containerDetails
 */
angular.module('dockstore.ui')
  .directive('containerDetails', function () {
    return {
      restrict: 'AE',
      controller: 'ContainerDetailsCtrl',
      scope: {
        containerPath: '=',
        containerToolname: '=',
        containerObj: '=',
        editMode: '=',
        activeTabs: '=',
        updateContainerObj: '&'
      },
      templateUrl: 'templates/containerdetails.html',
      link: function postLink(scope, element, attrs) {
        scope.$on('tagEditorRefreshContainer', function(event, containerId) {
          scope.refreshContainer(containerId, 2);
        });
        scope.$on('returnValid', function(event, valid){
          scope.validContent = valid;
          scope.checkContentValid();
          scope.refreshTagLaunchWith();
        });
        scope.$on('returnMissing', function(event,missing){
          scope.missingContent = missing;
        });
        scope.$on('invalidClass', function(event, invalid){
          scope.invalidClass = invalid;
        });

        scope.$on('refreshFiles', function() {
          scope.refreshTagLaunchWith();
        });
      }
    };
  });

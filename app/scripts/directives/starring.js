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
 * @name dockstore.ui.directive:starring
 * @description
 * # starring
 */
angular.module('dockstore.ui')
  .directive('starring', function() {
    return {
      restrict: 'AE',
      controller: 'StarringCtrl',
      scope: {
        workflowObj: '=',
        containerObj: '=',
        starGazers: '='

      },

      link: function postLink(scope, element, attrs) {
        scope.$watchGroup(['containerObj', 'workflowObj'], function() {
          if (scope.containerObj || scope.workflowObj){
            scope.setDocument();
            scope.getStarring(scope.userObj, scope.entryId, scope.entryType).then(function(data) {
              scope.rate = data;
            });
            scope.getStarredUsers(scope.userObj, scope.entryId, scope.entryType).then(function(data) {
              scope.total_stars = data;
            });
          }
        });
      },
      templateUrl: 'templates/starring.html'
    };
  });

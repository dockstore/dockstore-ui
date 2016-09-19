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
 * @ngdoc filter
 * @name dockstore.ui.filter:PreviewFilter
 * @function
 * @description
 * # PreviewFilter
 * Filter in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .filter('PreviewFilter', [function () {
    return function (containers, contLimit) {
      if (!contLimit) return containers;
      var sortedByBuildTime = containers.sort(function(a, b) {
      	if (!a.lastBuild) a.lastBuild = Number.MAX_VALUE;
      	if (!b.lastBuild) b.lastBuild = Number.MAX_VALUE;
        return a.lastBuild - b.lastBuild;
      });
      return sortedByBuildTime.slice(0, contLimit - 1);
    };
  }]);

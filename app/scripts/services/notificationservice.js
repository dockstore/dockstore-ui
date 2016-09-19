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
 * @ngdoc service
 * @name dockstore.ui.NotificationService
 * @description
 * # NotificationService
 * Service in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .service('NotificationService', [
  	'toaster',
  	'$timeout',
  	function (toaster, $timeout) {

      this.popInfo = function(title, message) {
        toaster.pop('info', title, message);
      };

      this.popSuccess = function(title, message) {
        toaster.pop('success', title, message);
      };

      this.popWarning = function(title, message) {
        toaster.pop('warning', title, message);
      };

      this.popError = function(title, message) {
        toaster.pop('error', title, message);
      };

      this.clearAll = function(sel) {
        sel = (typeof sel !== 'undefined') ? sel : '*';
        $timeout(function() { toaster.clear(sel); }, 1000);
      };

  }]);

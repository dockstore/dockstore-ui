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
 * @ngdoc function
 * @name dockstore.ui.controller:CopyTextCtrl
 * @description
 * # CopyTextCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('CopyTextCtrl', [
    '$scope',
    'NotificationService',
    function ($scope, NtfnService) {

      $scope.ntfyCopySuccess = function(message) {
        NtfnService.popSuccess('Copy Success', message);
      };

      $scope.ntfyCopyFailure = function(message) {
        NtfnService.popFailure('Copy Failure', message);
      };

      switch ($scope.length) {
        case 'very-short':
          $scope.lengthClass = 'col-md-2';
          break;
        case 'short':
          $scope.lengthClass = 'col-md-4';
          break;
        case 'normal':
          $scope.lengthClass = 'col-md-6';
          break;
        case 'long':
          $scope.lengthClass = 'col-md-8';
          break;
        case 'very-long':
          $scope.lengthClass = 'col-md-10';
          break;
        default:
          $scope.lengthClass = 'col-md-12';
      }

  }]);

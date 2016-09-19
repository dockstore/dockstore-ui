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
 * @name dockstore.ui.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('NavbarCtrl', [
    '$scope',
    '$rootScope',
    '$auth',
    '$location',
    'UserService',
    'NotificationService',
    function ($scope, $rootScope, $auth, $location,
                UserService, NtfnService) {

      $scope.userObj = UserService.getUserObj();

      $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
      };

      $scope.isHomePage = function() {
        return ($location.url() === '/');
      };

      $scope.logout = function() {
        UserService.logout();
      };

      $scope.changeMode = function() {
        if ($scope.searchMode === 'Tool') {
          $scope.searchMode = 'Workflow';
        } else if ($scope.searchMode === 'Workflow') {
          $scope.searchMode = 'Tool';
        }
      };

  }]).filter('shortenString', function() {
    return function (string, scope) {
      if (string !== null && string.length > 10) {
        return string.substring(0,9) + '...';
      } else {
        return string;
      }
    };
  });

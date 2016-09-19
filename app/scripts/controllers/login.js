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
 * @name dockstore.ui.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('LoginCtrl', [
    '$scope',
    '$auth',
    '$location',
    '$window',
    'UserService',
    'NotificationService',
    function ($scope, $auth, $location, $window,
        UserService, NtfnService) {

      $scope.login = function() {
        NtfnService.popError('Authentication Error',
            'Dockstore authentication by console login is currently disabled.');
        /* Disabled, no API Endpoint Available
        $auth.login($scope.user)
          .then(function() {
            console.info("Login successful for user: ", $scope.user);
            $location.path('/console');
          })
          .catch(function(response) {
            console.error("Error logging in: ", response.data.message);
          });
        */
      };

      $scope.authenticate = function(provider) {
        NtfnService.popInfo('Authentication Info',
          'Starting authentication via ' + provider + '.');
        $auth.authenticate(provider)
          .then(function(response) {
            var userId = response.data.userId;
            UserService.getUserById(userId)
              .then(function(response) {
                UserService.setUserObj(response);
                NtfnService.popSuccess('Authentication Success',
                  'Login successful via ' + provider + '.');
                $window.location.href = '/onboarding';
              }, function(response) {
                NtfnService.popError('Authentication Error', response);
                $auth.logout();
              });
          })
          .catch(function(response) {
            var message = (typeof response.statusText !== 'undefined') ?
              response.statusText : 'Unknown Error.';
            NtfnService.popError('Authentication Error', message);
          });
      };

  }]);

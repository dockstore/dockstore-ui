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
 * @name dockstore.ui.controller:AccountsCtrl
 * @description
 * # AccountsCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('AccountsCtrl', [
    '$scope',
    '$q',
    '$auth',
    '$location',
    '$window',
    'UserService',
    'TokenService',
    'WebService',
    'NotificationService',
    function ($scope, $q, $auth, $location, $window,
        UserService, TokenService, WebService, NtfnService) {

      $scope.userObj = UserService.getUserObj();

      $scope.linkGitHubAccount = function() {
        UserService.logout({
          title: 'Link GitHub Account',
          content: 'Please select the option, ' +
                    '"Sign in with GitHub" to continue.'
        });
      };

      $scope.linkBitbucketAccount = function() {
        $window.location.href = WebService.BITBUCKET_AUTH_URL +
          '?client_id=' + WebService.BITBUCKET_CLIENT_ID +
          '&response_type=code';
      };

      $scope.linkQuayIOAccount = function() {
        $window.location.href = WebService.QUAYIO_AUTH_URL +
          '?client_id=' + WebService.QUAYIO_CLIENT_ID +
          '&redirect_uri=' + WebService.QUAYIO_REDIRECT_URI +
          '&response_type=token' +
          '&realm=realm' +
          '&scope=' + WebService.QUAYIO_SCOPE;
      };

      TokenService.getUserTokenStatusSet($scope.userObj.id)
        .then(
          function(tokenStatusSet) {
            $scope.tokenStatusSet = tokenStatusSet;
            $scope.tokenSetComplete = tokenStatusSet.github;
          }
        );

  }]);

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
 * @name dockstore.ui.controller:TokensCtrl
 * @description
 * # TokensCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('TokensCtrl', [
    '$scope',
    '$q',
    '$auth',
    '$route',
    'UserService',
    'TokenService',
    'NotificationService',
    function ($scope, $q, $auth, $route,
        UserService, TokenService, NtfnService) {

      $scope.userObj = UserService.getUserObj();

      $scope.listTokens = function(userId) {
        return TokenService.getUserTokens(userId)
          .then(
            function(tokens) {
              $scope.tokens = tokens;
              return tokens;
            },
            function(response) {
              var message = '[HTTP ' + response.status + '] ' +
                  response.statusText + ': ' + response.data;
              NtfnService.popError('List Tokens', message);
              return $q.reject(response);
            }
          );
      };

      $scope.deleteToken = function(tokenId) {
        return TokenService.deleteToken(tokenId)
          .then(
            function(response) {
              $route.reload();
            },
            function(response) {
              var message = '[HTTP ' + response.status + '] ' +
                  response.statusText + ': ' + response.data;
              NtfnService.popError('Delete Token', message);
              return $q.reject(response);
            }
          );
      };

      $scope.listTokens($scope.userObj.id);

  }]);

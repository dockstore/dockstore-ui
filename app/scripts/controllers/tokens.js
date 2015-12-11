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

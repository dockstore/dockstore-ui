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
    '$auth',
    '$route',
    'UserService',
    'TokenService',
    'NotificationService',
    function ($scope, $auth, $route,
        UserService, TokenService, NtfnService) {

      $scope.userObj = UserService.getUserObj();

      $scope.listTokens = function(userId) {
        TokenService.getUserTokens(userId)
          .then(
            function(tokens) {
              $scope.tokens = tokens;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
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
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('Delete Token', message);
              return $q.reject(response);
            }
          );
      };

      $scope.listTokens($scope.userObj.id);

  }]);

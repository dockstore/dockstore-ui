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
    '$location',
    'UserService',
    'TokenService',
    'NotificationService',
    function ($scope, $auth, $location,
        UserService, TokenService, NtfnService) {

      $scope.listTokens = function() {
        NtfnService.popInfo('List Tokens', 'Retrieving list of tokens...');
        TokenService.getUserTokens(UserService.getUserObj().id)
          .then(function(tokens) {
            NtfnService.clearAll();
            $scope.tokens = tokens;
          }, function(response) {
            var message = (typeof response.statusText !== 'undefined') ?
              response.statusText : 'Unknown Error.';
            NtfnService.popError('List Tokens', message);
          });
      };

      $scope.deleteToken = function(tokenId) {
        return TokenService.deleteToken(tokenId)
          .then(function(response) {
            NtfnService.popSuccess('Delete Token Success',
                                    'Token ID: ' + tokenId);
            $location.path('#/tokens');
          }, function(response) {
            var message = (typeof response.statusText !== 'undefined') ?
              response.statusText : 'Unknown Error.';
            NtfnService.popError('Delete Token Error', message);
          });
      };

      $scope.listTokens();

  }]);

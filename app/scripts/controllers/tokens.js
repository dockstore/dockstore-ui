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
    'TokenService',
    'NotificationService',
    function ($scope, $auth, $location, TokenService, NtfnService) {

      $scope.listTokens = function() {
        NtfnService.popInfo('List Tokens', 'Retrieving list of tokens...');
        TokenService.getUserTokens()
          .then(function(tokens) {
            NtfnService.clearAll();
            $scope.userTokens = tokens;
          }, function(response) {
            var message = (typeof response.statusText !== 'undefined') ?
              response.statusText : 'Unknown Error.';
            NtfnService.popError('List Tokens', message);
          });
      };

      $scope.switchTokens = function(token) {
        $auth.setToken(token);
        NtfnService.popSuccess('Switch Tokens Success');
      };

      $scope.deleteToken = function(token_id) {
        return TokenService.deleteToken(token_id)
          .then(function(response) {
            NtfnService.popSuccess('Delete Token Success',
                                    'Token ID: ' + token_id);
          }, function(response) {
            var message = (typeof response.statusText !== 'undefined') ?
              response.statusText : 'Unknown Error.';
            NtfnService.popError('Delete Token Error', message);
          });
      };

      $scope.listTokens();
  }]);

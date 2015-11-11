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
            $scope.tokenSetComplete = 
              (tokenStatusSet.github && tokenStatusSet.quayio);
          }
        );

  }]);

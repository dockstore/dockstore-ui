angular.module('dockstore.ui')
  .controller('AccountsCtrl',
      ['$scope', '$auth', '$location', '$window', 'UserService', 'TokenService', 'NtfnService', 'WebService',
      function($scope, $auth, $location, $window, UserService, TokenService, NtfnService, WebService) {

    $scope.user = UserService.getUserObj();

    $scope.linkGitHubAccount = function() {
      $auth.logout()
        .then(function() {
          UserService.setUserObj(null);
          NtfnService.popSuccess('Logout', 'Logout successful.');
          NtfnService.popInfo('Link GitHub Account',
            'Please select the option, "Sign in with GitHub" to continue.');
          $location.path('/login');
        });
    };

    $scope.linkQuayioAccount = function() {
      $window.location.href = WebService.QUAYIO_AUTH_URL +
        '?client_id=' + WebService.QUAYIO_CLIENT_ID +
        '&redirect_uri=' + WebService.QUAYIO_REDIRECT_URI +
        '&response_type=token' +
        '&realm=realm' +
        '&scope=' + WebService.QUAYIO_SCOPE;
    };

    $scope.loadExternalAccounts = function() {
      NtfnService.popInfo('User External Accounts',
        'Retrieving list of external accounts...');
      TokenService.getUserTokens()
        .then(function(tokens) {
          NtfnService.clearAll();
          $scope.githubAccount = false;
          $scope.quayioAccount = false;
          for (var i = 0; i < tokens.length; i++){
            switch (tokens[i].tokenSource) {
              case 'github.com':
                $scope.githubAccount = true;
                break;
              case 'quay.io':
                $scope.quayioAccount = true;
                break;
            }
          }
        }, function(response) {
          var message = (typeof response.statusText != 'undefined') ?
            response.statusText : 'Unknown Error.';
          NtfnService.popError('User External Accounts', message);
        });
    };

    $scope.registerQuayioToken = function(userId, accessToken) {
      NtfnService.popInfo('User External Accounts',
        'Registering Quay.io access token...');
      TokenService.getUserTokens()
        .then(function(tokens) {
          NtfnService.popSuccess('User External Accounts',
            'Quay.io token registered successfully.');
        }, function(response) {
          var message = (typeof response.statusText != 'undefined') ?
            response.statusText : 'Unknown Error.';
          NtfnService.popError('User External Accounts', message);
        });
    }

    $scope.quaioAccTknRegexp = /access_token=([a-zA-Z0-9]*)/;
    if ($scope.quaioAccTknRegexp.test($location.url())) {
      var quayioAccTkn = $location.url().match($scope.quaioAccTknRegexp)[1];
      $scope.registerQuayioToken(UserService.getUserObj().id, quayioAccTkn);
      $window.location.href = '/accounts';
    } else {
      $scope.loadExternalAccounts();
    }

  }]);

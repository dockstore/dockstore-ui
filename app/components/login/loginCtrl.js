angular.module('dockstore.ui')
  .controller('LoginCtrl', ['$scope', '$auth', '$location', 'NtfnService',
      function($scope, $auth, $location, NtfnService) {

    $scope.login = function() {
      NtfnService.popError('Authentication Error',
          'Dockstore authentication by console login is currently disabled.');
      /* Disabled, no API Endpoint Available
      $auth.login($scope.user)
        .then(function() {
          console.info("Login successful for user: ", $scope.user);
          $location.path('#/console');
        })
        .catch(function(response) {
          console.error("Error logging in: ", response.data.message);
        });
      */
    };

    $scope.authenticate = function(provider) {
      NtfnService.popInfo('Authentication Info',
        'Staring authentication via ' + provider + '.');
      $auth.authenticate(provider)
        .then(function() {
          NtfnService.popSuccess('Authentication Success',
            'Login successful via ' + provider + '.');
          $location.path('#/console');
        })
        .catch(function(response) {
          var message = (typeof response.statusText != 'undefined') ?
            response.statusText : 'Unknown Error.';
          NtfnService.popError('Authentication Error', message);
        });
    };

  }]);

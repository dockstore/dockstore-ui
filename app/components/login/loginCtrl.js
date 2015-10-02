angular.module('dockstore.ui')
  .controller('LoginCtrl', ['$scope', '$auth', '$location',
      function($scope, $auth, $location) {

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function() {
          console.info("Login successful for user: ", $scope.user);
          $location.path('#/console');
        })
        .catch(function(response) {
          console.error("Error logging in: ", response.data.message);
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          console.info("Login successful via provider: ", provider);
          $location.path('#/console');
        })
        .catch(function(response) {
          console.error("Error logging in: ", response.data.message);
        });
    };

  }]);

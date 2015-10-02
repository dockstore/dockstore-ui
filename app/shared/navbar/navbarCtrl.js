angular.module('dockstore.ui')
  .controller('NavbarCtrl', ['$scope', '$auth', '$location',
      function($scope, $auth, $location) {
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
    $scope.logout = function() {
      if (!$auth.isAuthenticated()) {
        $location.path('#/login');
        return;
      }
      $auth.logout()
        .then(function() {
          console.info('Logout successful.');
          $location.path('#/search');
        });
    };
  }]);

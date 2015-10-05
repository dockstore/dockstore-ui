angular.module('dockstore.ui')
  .controller('NavbarCtrl', ['$scope', '$auth', '$location', 'NtfnService',
      function($scope, $auth, $location, NtfnService) {

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
          NtfnService.popSuccess('Logout', 'Logout successful.');
          $location.path('#/search');
        });
    };

  }]);

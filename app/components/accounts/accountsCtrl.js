angular.module('dockstore.ui')
  .controller('AccountsCtrl', ['$scope', '$auth', '$location',
      function($scope, $auth, $location) {

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

  }]);

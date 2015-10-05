angular.module('dockstore.ui')
  .controller('ConsoleCtrl', ['$scope', '$auth', '$location',
      function($scope, $auth, $location) {

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

  }]);

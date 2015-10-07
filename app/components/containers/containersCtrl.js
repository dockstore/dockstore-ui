angular.module('dockstore.ui')
  .controller('ContainersCtrl', ['$scope', '$auth', '$location',
      function($scope, $auth, $location) {

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

  }]);

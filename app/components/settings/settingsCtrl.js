angular.module('dockstore.ui')
  .controller('SettingsCtrl', ['$scope', '$auth', '$location',
      function($scope, $auth, $location) {

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

  }]);

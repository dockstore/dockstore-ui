angular.module('dockstore.ui')
  .controller('DocsCtrl', ['$scope', '$auth', '$location',
      function($scope, $auth, $location) {

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

  }]);

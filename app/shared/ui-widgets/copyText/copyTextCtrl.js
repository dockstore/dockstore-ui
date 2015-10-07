angular.module('dockstore.ui')
  .controller('CopyTextCtrl', ['$scope', 'NtfnService',
      function($scope, NtfnService) {

    $scope.ntfyCopySuccess = function(message) {
      NtfnService.popSuccess('Copy Success', message);
    };

    $scope.ntfyCopyFailure = function(message) {
      NtfnService.popFailure('Copy Failure', message);
    };

  }]);

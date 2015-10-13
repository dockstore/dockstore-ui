angular.module('dockstore.ui')
  .controller('SearchContainerCtrl', ['$scope', '$routeParams', 'NtfnService',
      function($scope, $routeParams, NtfnService) {

    $scope.selContId = $routeParams.contId;
    $scope.selContName = '';
    $scope.selContNamespace = '';

  }]);

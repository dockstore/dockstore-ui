angular.module('dockstore.ui')
  .controller('ContainersEditorCtrl',
      ['$scope', 'DockerRepoService', 'NtfnService',
      function($scope, DockerRepoService, NtfnService) {

    NtfnService.popInfo('List Account Containers', 'Loading container list...');
    DockerRepoService.getRegisteredContainers(2/*$routeParams.userId*/)
      .then(function(response) {
        NtfnService.clearAll();
        $scope.registeredContainers = response.data;
      })
      .catch(function(response) {
        var message = (typeof response.statusText != 'undefined') ?
          response.statusText : 'Unknown Error.';
        NtfnService.popError('Account Containers', message);
      });

  }]);

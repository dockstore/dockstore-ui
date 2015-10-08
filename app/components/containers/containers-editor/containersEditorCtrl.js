angular.module('dockstore.ui')
  .controller('ContainersEditorCtrl',
      ['$scope', 'DockerRepoService', 'UserService', 'NtfnService',
      function($scope, DockerRepoService, UserService, NtfnService) {

    NtfnService.popInfo('List Account Containers', 'Loading container list...');
    DockerRepoService.getUserRegisteredContainers(UserService.getUserObj().id)
      .then(function(containers) {console.log('Containers:', containers);
        NtfnService.clearAll();
        $scope.registeredContainers = containers;
      }, function(response) {
        var message = (typeof response.statusText != 'undefined') ?
          response.statusText : 'Unknown Error.';
        NtfnService.popError('Account Containers', message);
      });

  }]);

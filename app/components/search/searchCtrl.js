angular.module('dockstore.ui')
  .controller('SearchCtrl', ['$scope', 'DockerRepoService', 'NtfnService',
      function($scope, DockerRepoService, NtfnService) {

    NtfnService.popInfo('List Docker Containers', 'Loading container lists...')
    DockerRepoService.getDockerContainerList()
      .then(function(response) {
        NtfnService.clearAll();
        $scope.dockerContainerList = response.data;
      })
      .catch(function(response) {
        var message = (typeof response != 'undefined') ?
          response.data.message : 'Unknown Error.';
        NtfnService.popError('List Docker Containers', message);
      });

  }]);

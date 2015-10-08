angular.module('dockstore.ui')
  .controller('SearchContainerCtrl',
      ['$scope', '$routeParams', 'DockerRepoService', 'NtfnService',
      function($scope, $routeParams, DockerRepoService, NtfnService) {

    NtfnService.popInfo('Docker Container Details',
      'Retrieving ' +  $routeParams.reposName + ' container metadata.');
    DockerRepoService.getDockerRepos($routeParams.userId,
        $routeParams.reposNamespace + '%2F' + $routeParams.reposName)
      .then(function(repos) {
        NtfnService.clearAll();
        $scope.dockerContainer = repos;
      })
      .catch(function(response) {
        var message = (typeof response.statusText != 'undefined') ?
          response.statusText : 'Unknown Error.';
        NtfnService.popError('Docker Container Details', message);
      });

  }]);

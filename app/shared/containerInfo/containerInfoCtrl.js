angular.module('dockstore.ui')
  .controller('ContainersInfoCtrl',
      ['$scope', 'DockerRepoService', 'UserService', 'NtfnService',
      function($scope, DockerRepoService, UserService, NtfnService) {

    $scope.loadContainerDetails = function(user_id, cont_ns, cont_name) {
      NtfnService.popInfo('Docker Container Details',
      'Retrieving ' +  cont_name + ' container metadata.');
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
    };

  }]);

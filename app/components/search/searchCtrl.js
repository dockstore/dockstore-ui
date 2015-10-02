angular.module('dockstore.ui')
  .controller('SearchCtrl', ['$scope', 'DockerRepoService',
      function($scope, DockerRepoService) {
console.log('test!');
    DockerRepoService.getDockerContainerList()
      .then(function(response) {
        $scope.dockerContainerList = response.data;
      });

  }]);

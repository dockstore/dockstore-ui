angular.module('dockstore.ui')
  .controller('SearchCtrl', ['$scope', 'ContainerService', 'NtfnService',
      function($scope, ContainerService, NtfnService) {

    NtfnService.popInfo('List Docker Containers', 'Loading container lists...');
    ContainerService.getDockerContainerList()
      .then(function(containers) {
        NtfnService.clearAll();
        $scope.dockerContainerList = containers;
      })
      .catch(function(response) {
        var message = (typeof response.statusText != 'undefined') ?
          response.statusText : 'Unknown Error.';
        NtfnService.popError('List Docker Containers', message);
      });

  }]);

angular.module('dockstore.ui')
  .service('DockerRepoService', ['$http', 'WebService',
      function($http, WebService) {

    this.getDockerContainerList = function() {
      return $http({
        method: 'GET',
        url: WebService.API_URL + '/docker.repo'
      });
    };

    this.searchDockerContainers = function(query_string) {
      return $http({
        method: 'GET',
        url: WebService.API_URL + '/docker.repo/searchContainers',
        params: {
          pattern: query_string
        }
      });
    };

  }]);

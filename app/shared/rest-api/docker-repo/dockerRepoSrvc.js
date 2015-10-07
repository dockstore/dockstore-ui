angular.module('dockstore.ui')
  .service('DockerRepoService', ['$http', 'WebService',
      function($http, WebService) {

    this.getDockerContainerList = function() {
      return $http({
        method: 'GET',
        url: WebService.DEBUG_MODE ?
              WebService.API_URL_DEBUG + '/docker.repo.json?' + Math.random() :
              WebService.API_URL + '/docker.repo'
      });
    };

    this.getDockerRepos = function(user_id, repository) {
      return $http({
        method: 'GET',
        url: //WebService.DEBUG_MODE ?
              //WebService.API_URL_DEBUG + '/docker.repo/searchContainers.json' :
              WebService.API_URL + '/docker.repo/getRepo/' + user_id + '/' + repository
      });
    };

    this.getRegisteredContainers = function(user_id) {
      return $http({
        method: 'GET',
        url: //WebService.DEBUG_MODE ?
              //WebService.API_URL_DEBUG + '/docker.repo/searchContainers.json' :
              //WebService.API_URL + '/docker.repo/getUserRegisteredContainers?user_id=' + user_id
              WebService.API_URL_DEBUG + '/docker.repo.json?' + Math.random()
      });
    };

    this.searchDockerContainers = function(query_string) {
      return $http({
        method: 'GET',
        url: WebService.DEBUG_MODE ?
              WebService.API_URL_DEBUG + '/docker.repo/searchContainers.json?' + Math.random() :
              WebService.API_URL + '/docker.repo/searchContainers',
        params: {
          pattern: query_string
        }
      });
    };

  }]);

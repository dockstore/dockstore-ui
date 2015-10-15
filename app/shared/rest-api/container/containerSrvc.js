angular.module('dockstore.ui')
  .service('ContainerService', ['$q', '$http', 'WebService',
      function($q, $http, WebService) {

    this.getDockerContainerList = function() {
      var resUrl = //WebService.DEBUG_MODE ?
        //WebService.API_URL_DEBUG + '/docker.repo/docker.repo.json' :
        WebService.API_URL + '/container';
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: resUrl
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getDockerContainer = function(cont_id) {
      var resUrl = //WebService.DEBUG_MODE ?
        //WebService.API_URL_DEBUG + '/docker.repo/docker.repo.json' :
        WebService.API_URL + '/container/' + cont_id;
      /* This is for the demo */
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: resUrl
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getCollabJSON = function(cont_path) {
      var resUrl = WebService.DEBUG_MODE ?
        WebService.API_URL_DEBUG +
          '/docker.repo/collab.json' :
        WebService.API_URL +
          '/container/collab?repository=' + cont_path;
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: resUrl
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getUserRegisteredContainers = function(user_id) {
      var resUrl = WebService.DEBUG_MODE ?
        WebService.API_URL_DEBUG +
          '/docker.repo/getUserRegisteredContainers.json' :
        WebService.API_URL +
          '/docker.repo/getUserRegisteredContainers?user_id=' + user_id;
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: resUrl
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.searchDockerContainers = function(query_string) {
      var resUrl = WebService.DEBUG_MODE ?
        WebService.API_URL_DEBUG +
          '/docker.repo/searchContainers.json' :
          WebService.API_URL + '/docker.repo/searchContainers';
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: resUrl,
          params: {
            pattern: query_string
          }
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

  }]);

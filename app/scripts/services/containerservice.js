'use strict';

/**
 * @ngdoc service
 * @name dockstore.ui.ContainerService
 * @description
 * # ContainerService
 * Service in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .service('ContainerService', [
      '$q',
      '$http',
      'WebService',
      function ($q, $http, WebService) {
    
    this.getDockerContainerList = function() {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/container'
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getDockerContainer = function(cont_id) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/container/' + cont_id
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getCollabJSON = function(cont_path) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/container/collab?repository=' + cont_path
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getUserRegisteredContainers = function(user_id) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI +
            '/docker.repo/getUserRegisteredContainers?user_id=' + user_id
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.searchDockerContainers = function(query_string) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/docker.repo/searchContainers',
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

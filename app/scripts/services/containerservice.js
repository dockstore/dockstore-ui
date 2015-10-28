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
          url: WebService.API_URI + '/containers/allRegistered'
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
          url: WebService.API_URI + '/containers/' + cont_id
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.refreshContainers = function(userId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'PUT',
          url: WebService.API_URI + '/containers/refresh',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            id: userId
          }
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };


    this.getDockerFile = function(reposPath) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/dockerfile',
          params: {
            repository: reposPath
          }
        }).then(function(response) {
          resolve(response.data.content);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getCollabFile = function(reposPath) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/collab',
          params: {
            repository: reposPath
          }
        }).then(function(response) {
          resolve(response.data.content);
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

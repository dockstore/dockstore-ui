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

    this.getRegisteredContainerList = function() {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/registered'
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getRegisteredContainerById = function(containerId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/registered/' + containerId
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getRegisteredContainerByPath = function(containerPath) {
      var containerPathEncoded = containerPath.replace(/\//g, '%2F');
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/path/' + containerPathEncoded + 
                '/registered/'
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getRegisteredContainerByToolPath = function(containerPath) {
      var containerPathEncoded = containerPath.replace(/\//g, '%2F');
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/path/tool/' + containerPathEncoded + 
                '/registered/'
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getUserContainerList = function(userId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/users/' + userId + '/containers'
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.createContainer = function(containerObj) {
      return $q(function(resolve, reject) {
        $http({
          method: 'POST',
          url: WebService.API_URI + '/containers/registerManual',
          headers: {
            'Content-Type': 'application/json'
          },
          data: containerObj
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.registerContainer = function(containerObj) {
      return $q(function(resolve, reject) {
        $http({
          method: 'POST',
          url: WebService.API_URI + '/containers/registered',
          headers: {
            'Content-Type': 'application/json'
          },
          data: containerObj
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.refreshContainer = function(containerId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/' + containerId + '/refresh',
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.refreshUserContainers = function(userId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/users/' + userId + '/containers/refresh',
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.setContainerRegistration = function(containerId, isRegistered) {
      return $q(function(resolve, reject) {
        $http({
          method: 'POST',
          url: WebService.API_URI + '/containers/' + containerId + '/register',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            register: isRegistered
          }
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.deleteContainer = function(containerId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'DELETE',
          url: WebService.API_URI + '/containers/' + containerId,
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.updateContainerTag = function(containerId, tagObj) {
      return $q(function(resolve, reject) {
        $http({
          method: 'PUT',
          url: WebService.API_URI + '/containers/' + containerId + '/tags',
          headers: {
            'Content-Type': 'application/json'
          },
          data: [tagObj]
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.createContainerTag = function(containerId, tagObj) {
      return $q(function(resolve, reject) {
        $http({
          method: 'POST',
          url: WebService.API_URI + '/containers/' + containerId + '/tags',
          headers: {
            'Content-Type': 'application/json'
          },
          data: [tagObj]
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.deleteContainerTag = function(containerId, tagId) {
      return $q(function(resolve, reject) {
        $http({
          method: 'DELETE',
          url: WebService.API_URI + '/containers/' + containerId +
              '/tags/' + tagId
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.setContainerLabels = function(containerId, labels) {
      return $q(function(resolve, reject) {
        $http({
          method: 'PUT',
          url: WebService.API_URI + '/containers/' + containerId + '/labels',
          params: {
            labels: labels
          }
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getDockerFile = function(containerId, tagName) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/' + containerId + '/dockerfile',
          params: {
            tag: tagName
          }
        }).then(function(response) {
          resolve(response.data.content);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getDescriptorFile = function(containerId, tagName) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URI + '/containers/' + containerId + '/cwl',
          params: {
            tag: tagName
          }
        }).then(function(response) {
          resolve(response.data.content);
        }, function(response) {
          reject(response);
        });
      });
    };

  }]);

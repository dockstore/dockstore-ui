angular.module('dockstore.ui')
  .service('UserService',
      ['$rootScope', '$q', '$http', 'WebService', 'localStorageService',
      function($rootScope, $q, $http, WebService, localStorageService) {

    this.getUserById = function(user_id) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URL + '/user/getUser?user_id=' + user_id
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.getUserByUsername = function(username) {
      return $q(function(resolve, reject) {
        $http({
          method: 'GET',
          url: WebService.API_URL + '/user/username/' + username
        }).then(function(response) {
          resolve(response.data);
        }, function(response) {
          reject(response);
        });
      });
    };

    this.setUserObj = function(userObj) {
      $rootScope.$broadcast('userObjRefresh', userObj);
      localStorageService.set('user', userObj);
    };

    this.getUserObj = function() {
      return localStorageService.get('user');
    };

  }]);

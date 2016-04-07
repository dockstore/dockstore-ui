'use strict';

/**
 * @ngdoc service
 * @name dockstore.ui.UserService
 * @description
 * # UserService
 * Service in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .service('UserService', [
    '$rootScope',
    '$auth',
    '$q',
    '$http',
    '$location',
    'localStorageService',
    'WebService',
    'NotificationService',
    function ($rootScope, $auth, $q, $http, $location, localStorageService,
                WebService, NtfnService) {

      this.getUserById = function(userId) {
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/users/' + userId
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
            url: WebService.API_URI + '/users/username/' + username
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };

      this.setUserObj = function(userObj) {
        $rootScope.$broadcast('userObjChange', userObj);
        localStorageService.set('userObj', userObj);
      };

      this.getUserObj = function() {
        return localStorageService.get('userObj');
      };

      this.logout = function(infoMsg) {
        if (!$auth.isAuthenticated()) {
          $location.path('/login');
          return;
        }
        var self = this;
        $auth.logout()
          .then(function() {
            self.setUserObj(null);
            NtfnService.popSuccess('Logout', 'Logout successful.');
            if (infoMsg) {
              NtfnService.popInfo(infoMsg.title, infoMsg.content);
              $location.path('/login');
            } else {
              $location.path('/search-containers');
            }
          });
      };

  }]);

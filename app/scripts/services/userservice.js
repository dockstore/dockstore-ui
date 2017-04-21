/*
 *    Copyright 2016 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

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
    'md5',
    function($rootScope, $auth, $q, $http, $location, localStorageService,
      WebService, NtfnService, md5) {

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

      this.gravatarUrl = function(email, defaultImg) {
        if (email) {
          return "https://www.gravatar.com/avatar/" + md5.createHash(email) + "?d=" + defaultImg + "&s=500";
        } else {
          if (defaultImg) {
            return defaultImg;
          } else {
            return "http://www.imcslc.ca/imc/includes/themes/imc/images/layout/img_placeholder_avatar.jpg";
          }
        }
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

      this.updateUserMetadata = function() {
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/users/user/updateUserMetatdata'
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
      this.getStarredWorkflows = function() {
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/users/starredWorkflows/'
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };
      this.getStarredTools = function() {
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/users/starredTools/'
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };
    }
  ]);

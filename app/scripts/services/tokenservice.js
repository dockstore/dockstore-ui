'use strict';

/**
 * @ngdoc service
 * @name dockstore.ui.TokenService
 * @description
 * # TokenService
 * Service in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .service('TokenService', [
    '$rootScope',
    '$q',
    '$http',
    'WebService',
    function ($rootScope, $q, $http, WebService) {
    
      /* Probabably want to do this with an explicit user_id */
      this.getUserTokens = function() {
        var resUrl = WebService.DEBUG_MODE ?
          WebService.API_URI_DEBUG + '/token/listOwned.json' :
          WebService.API_URI + '/token/listOwned';
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

      this.deleteToken = function(token_id) {
        var resUrl = WebService.API_URI + '/token/' + token_id;
        return $q(function(resolve, reject) {
          $http({
            method: 'DELETE',
            url: resUrl
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };

      this.registerQuayioAccessToken = function(userId, accessToken) {
        var resUrl = WebService.API_URI + '/token/quay.io/' + userId;
        return $q(function(resolve, reject) {
          $http({
            method: 'POST',
            url: resUrl,
            params: {
              access_token: accessToken
            }
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };

  }]);

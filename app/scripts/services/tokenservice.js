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
      this.getUserTokens = function(userId) {
        var resUrl = WebService.API_URI + '/users/' + userId + '/tokens';
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

      /* This will be refactored to be more robust and consistent later... */
      this.hasGitHubQuayIOTokens = function(userId) {
        return this.getUserTokens(userId)
          .then(function(tokens) {
            var hasGithubAccount = false;
            var hasQuayIOAccount = false;
            for (var i = 0; i < tokens.length; i++){
              switch (tokens[i].tokenSource) {
                case 'github.com':
                  hasGithubAccount = true;
                  break;
                case 'quay.io':
                  hasQuayIOAccount = true;
                  break;
              }
            }
            return hasGithubAccount && hasQuayIOAccount;
          });
      };

      this.deleteToken = function(tokenId) {
        var resUrl = WebService.API_URI + '/auth/tokens/' + tokenId;
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
        var resUrl = WebService.API_URI + '/auth/tokens/quay.io/';
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
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

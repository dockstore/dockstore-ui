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
    'NotificationService',
    function ($rootScope, $q, $http,
              WebService, NtfnService) {

      this.getUserTokens = function(userId) {
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/users/' + userId + '/tokens'
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };

      this.registerBitbucketToken = function(userId, accessToken) {
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/auth/tokens/bitbucket.org/',
            params: {
              code: accessToken
            }
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };

      this.registerGitlabToken = function(userId, accessToken) {
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/auth/tokens/gitlab.com/',
            params: {
              code: accessToken
            }
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };

      this.registerQuayIOToken = function(userId, accessToken) {
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/auth/tokens/quay.io/',
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

      this.deleteToken = function(tokenId) {
        return $q(function(resolve, reject) {
          $http({
            method: 'DELETE',
            url: WebService.API_URI + '/auth/tokens/' + tokenId
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };

      this.getUserToken = function(userId, source) {
        return this.getUserTokens(userId)
          .then(
            function(tokens) {
              for (var i = 0; i < tokens.length; i++) {
                if (tokens[i].tokenSource === source) return tokens[i];
              }
              return $q.reject();
            },
            function(response) {
              var message = '[HTTP ' + response.status + '] ' +
                  response.statusText + ': ' + response.data;
              NtfnService.popError('User Accounts', message);
              return $q.reject(response);
            }
          );
      };

      this.getUserTokenStatusSet = function(userId) {
        return this.getUserTokens(userId)
          .then(
            function(tokens) {
              var tokenStatusSet = {
                dockstore: false,
                github: false,
                bitbucket: false,
                quayio: false,
                gitlab: false
              };
              for (var i = 0; i < tokens.length; i++) {
                switch (tokens[i].tokenSource) {
                  case 'dockstore':
                    tokenStatusSet.dockstore = true;
                    break;
                  case 'github.com':
                    tokenStatusSet.github = true;
                    break;
                  case 'bitbucket.org':
                    tokenStatusSet.bitbucket = true;
                    break;
                  case 'quay.io':
                    tokenStatusSet.quayio = true;
                    break;
                  case 'gitlab.com':
                    tokenStatusSet.gitlab = true;
                    break;
                }
              }
              return tokenStatusSet;
            },
            function(response) {
              var message = '[HTTP ' + response.status + '] ' +
                  response.statusText + ': ' + response.data;
              NtfnService.popError('User Accounts', message);
              return $q.reject(response);
            }
          );
      };

      this.getWebServiceVersion = function() {
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/api/ga4gh/v1/metadata'
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };

      this.getGA4GHTools = function(organization) {
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/extendedGA4GH/' + organization
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };

      this.getToolsByOrg = function(organization) {
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/extendedGA4GH/entries/' + organization
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };

      this.getWorkflowsByOrg = function(organization) {
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/extendedGA4GH/workflows/' + organization
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };

      this.getOrganizations = function() {
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/extendedGA4GH/organizations'
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };
  }]);

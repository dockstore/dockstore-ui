'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:AuthenticationCtrl
 * @description
 * # AuthenticationCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('AuthenticationCtrl', [
    '$scope',
    '$q',
    '$location',
    '$window',
    'ContainerService',
    'TokenService',
    'UserService',
    function ($scope, $q, $location, $window,
        ContainerService, TokenService, UserService) {

      $scope.userObj = UserService.getUserObj();

      $scope.registerQuayIOToken = function(userId, accessToken) {
        return TokenService.registerQuayIOToken(userId, accessToken)
          .then(
            function(token) {
              return token;
            },
            function(response) {
              $scope.errorMsg =
                '[HTTP ' + response.status + '] ' + response.statusText + '. ' +
                'Error registering Quay.io token.';
              return $q.reject(response);
            }
          );
      };

      $scope.registerBitbucketToken = function(userId, accessToken) {
        return TokenService.registerBitbucketToken(userId, accessToken)
          .then(
            function(token) {
              return token;
            },
            function(response) {
              $scope.errorMsg =
                '[HTTP ' + response.status + '] ' + response.statusText + '. ' +
                'Error registering Bitbucket token.';
              return $q.reject(response);
            }
          );
      };

      $scope.refreshUserContainers = function(userId) {
        return ContainerService.refreshUserContainers(userId)
          .then(
            function(containers) {
              return containers;
            },
            function(response) {
              $scope.errorMsg =
                '[HTTP ' + response.status + '] ' + response.statusText + '. ' +
                'Error refreshing containers.';
              return $q.reject(response);
            }
          );
      };
    
      var providerRegExp = /^\/auth\/([a-zA-Z-\.]*).*$/;
      var provider = $location.url().match(providerRegExp)[1];

      switch (provider) {
        case 'github.com':
          $scope.providerName = 'GitHub';
          // Currently handled by Satellizer
          $window.location.href = '/login';
          break;
        case 'bitbucket.org':
          $scope.providerName = 'Bitbucket';
          var bitbucketTokenRegExp = /code=([a-zA-Z0-9]*)/;
          var bitbucketToken = $location.url().match(bitbucketTokenRegExp);
          if (bitbucketToken) {
            $scope.registerBitbucketToken($scope.userObj.id, bitbucketToken[1])
              .then(
                function() {
                  $window.location.href = '/onboarding';
                }
              );
          } else {
            $window.location.href = '/login';
          }
          break;
        case 'quay.io':
          $scope.providerName = 'Quay.io';
          var quayTokenRegExp = /access_token=([a-zA-Z0-9]*)/;
          var quayToken = $location.url().match(quayTokenRegExp);
          if (quayToken) {
            $scope.registerQuayIOToken($scope.userObj.id, quayToken[1])
              .then(
                function() {
                  $scope.refreshingContainers = true;
                  $scope.refreshUserContainers($scope.userObj.id)
                    .then(
                      function(containers) {
                        $window.location.href = '/onboarding';
                      }, function() {
                        $scope.refreshingContainers = false;
                      }
                    );
                }
              );
          } else {
            $window.location.href = '/login';
          }
          break;
        default:
          $window.location.href = '/login';
      }

  }]);

'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:OnboardingCtrl
 * @description
 * # OnboardingCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('OnboardingCtrl', [
    '$scope',
    '$q',
    '$auth',
    '$location',
    '$window',
    'UserService',
    'TokenService',
    'ContainerService',
    'WebService',
    'NotificationService',
    function ($scope, $q, $auth, $location, $window,
        UserService, TokenService, ContainerService, WebService, NtfnService) {

      $scope.userObj = UserService.getUserObj();
      $scope.dscliReleaseURL = WebService.DSCLI_RELEASE_URL;
      $scope.dsServerURI = WebService.API_URI;
      $scope.dsToken = $auth.getToken();

      $scope.owStep = 1;
      $scope.prevStep = function() {
        $scope.owStep--;
      };
      $scope.nextStep = function() {
        if (!$scope.tokenSetComplete) return;
        switch ($scope.owStep) {
          case 1:
          case 2:
            $scope.owStep++;
            break;
          default:
            $location.path('/search');
        }
      };

      $scope.linkGitHubAccount = function() {
        UserService.logout({
          title: 'Link GitHub Account',
          content: 'Please select the option, ' +
                    '"Sign in with GitHub" to continue.'
        });
      };

      $scope.linkQuayIOAccount = function() {
        $window.location.href = WebService.QUAYIO_AUTH_URL +
          '?client_id=' + WebService.QUAYIO_CLIENT_ID +
          '&redirect_uri=' + WebService.QUAYIO_REDIRECT_URI +
          '&response_type=token' +
          '&realm=realm' +
          '&scope=' + WebService.QUAYIO_SCOPE;
      };

      $scope.registerQuayIOToken = function(userId, accessToken) {
        return TokenService.registerQuayIOToken(userId, accessToken)
          .then(
            function(token) {},
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('User Accounts', message);
              return $q.reject(response);
            }
          );
      };

      $scope.refreshUserContainers = function(userId) {
        NtfnService.popInfo('Refresh User Containers',
          'Refreshing Quay.io containers...');
        return ContainerService.refreshUserContainers(userId)
          .then(
            function(containers) {
              NtfnService.popSuccess('Refresh User Containers',
                'Successfully refreshed the Dockstore container cache.');
              return containers;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('Refresh User Containers', message);
              return $q.reject(response);
            }
          );
      };

      $scope.redirectQuayIOTokenRegister = function() {
        var quayIOTokenRegExp = /access_token=([a-zA-Z0-9]*)/;
        if (quayIOTokenRegExp.test($location.url())) {
          var quayIOToken = $location.url().match(quayIOTokenRegExp)[1];
          $scope.quayIOHold = true;
          $scope.registerQuayIOToken($scope.userObj.id, quayIOToken)
            .then(
              function() {
                $scope.refreshUserContainers($scope.userObj.id)
                  .then(function(containers) {
                    $scope.quayIOHold = false;
                    $window.location.href = '/onboarding';
                  });
              }
            );
        }
      };

      $scope.redirectQuayIOTokenRegister();

      TokenService.getUserTokenStatusSet($scope.userObj.id)
        .then(
          function(tokenStatusSet) {
            $scope.tokenStatusSet = tokenStatusSet;
            $scope.tokenSetComplete = 
              (tokenStatusSet.github && tokenStatusSet.quayio);
          }
        );

  }]);

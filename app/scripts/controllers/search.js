'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('SearchCtrl', [
    '$scope',
    '$rootScope',
    '$q',
    '$window',
    '$location',
    '$auth',
    '$routeParams',
    'ContainerService',
    'UserService',
    'TokenService',
    'NotificationService',
    function ($scope, $rootScope, $q, $window, $location, $auth, $routeParams,
        ContainerService, UserService, TokenService, NtfnService) {

      $scope.userObj = UserService.getUserObj();

      $scope.listRegisteredContainers = function() {
        return ContainerService.getRegisteredContainerList()
          .then(
            function(containers) {
              $scope.containers = containers;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('List Registered Containers', message);
              return $q.reject(response);
            }
          );
      };

      if ($auth.isAuthenticated()) {
        TokenService.getUserTokenStatusSet($scope.userObj.id)
          .then(
            function(tokenStatusSet) {
              $scope.tokenStatusSet = tokenStatusSet;
              if (!(tokenStatusSet.github && tokenStatusSet.quayio)) {
                $window.location.href = '/onboarding';
              }
            }
          );
      }

      // incomplete
      // $scope.$on('$locationChangeStart', function(event, newState, oldState) {
      //   if ($rootScope.searchQuery && $rootScope.searchQuery.length > 0) {
      //     $rootScope.searchQuery = '';
      //   }
      // });

      if ($routeParams.searchQuery) {
        $rootScope.searchQuery = $routeParams.searchQuery;
      }

      $scope.listRegisteredContainers();
      
  }]);

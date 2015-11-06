'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:ContainersCtrl
 * @description
 * # ContainersCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('ContainersCtrl', [
    '$scope',
    '$q',
    '$window',
    '$auth',
    'ContainerService',
    'UserService',
    'TokenService',
    'NotificationService',
    function ($scope, $q, $window, $auth,
        ContainerService, UserService, TokenService, NtfnService) {

      $scope.userObj = UserService.getUserObj();

      $scope.listUserContainers = function(userId) {
        return ContainerService.getUserContainerList(userId)
          .then(
            function(containers) {
              $scope.containers = containers;
              return containers;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('List User Containers', message);
              return $q.reject(response);
            }
          );
      };

      $scope.sortNSContainers = function(containers) {
        var nsContainers = [];
        var getNSIndex = function(namespace) {
          for (var i = 0; i < nsContainers.length; i++) {
            if (nsContainers[i].namespace === namespace) return i;
          }
          return -1;
        } 
        for (var i = 0; i < containers.length; i++) {
          var pos = getNSIndex(containers[i].namespace);
          if (pos < 0) {
            nsContainers.push({
              namespace: containers[i].namespace,
              containers: []
            });
            pos = nsContainers.length - 1;
          }
          nsContainers[pos].containers.push(containers[i]);
        }
        // sort containers and container namespaces
        return nsContainers;
      };

      $scope.selectContainer = function(containerId) {
        for (var i = 0; i < $scope.containers.length; i++) {
          if ($scope.containers[i].id === containerId) {
            $scope.selContainerObj = $scope.containers[i];
            break;
          }
        }
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

      $scope.listUserContainers($scope.userObj.id)
        .then(
          function(containers) {
            $scope.nsContainers = $scope.sortNSContainers(containers);
            if ($scope.nsContainers.length > 0) {
              $scope.selectContainer($scope.nsContainers[0].containers[0].id);
            }
          },
          function(response) {
            var message = '[' + response.status + '] ' + response.statusText;
            NtfnService.popError('Docker User Containers', message);
            return $q.reject(response);
          }
        );

  }]);

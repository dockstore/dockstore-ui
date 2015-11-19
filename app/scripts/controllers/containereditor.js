'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:ContainerEditorCtrl
 * @description
 * # ContainerEditorCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('ContainerEditorCtrl', [
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

      $scope.refreshUserContainers = function(userId) {
        $scope.refreshingContainers = true;
        return ContainerService.refreshUserContainers(userId)
          .then(
            function(containers) {
              $scope.refreshingContainers = false;
              $window.location.href = '/my-containers';
              return containers;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('Refresh User Containers', message);
              return $q.reject(response);
            }
          );
      };

      $scope.sortNSContainers = function(containers, username) {
        var nsContainers = [];
        /* Group Containers by Common Namespace */
        var getNSIndex = function(namespace) {
          for (var i = 0; i < nsContainers.length; i++) {
            if (nsContainers[i].namespace === namespace) return i;
          }
          return -1;
        };
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
        /* Sort Containers in Each Namespace */
        for (var j = 0; j < nsContainers.length; j++) {
          nsContainers[j].containers.sort(function(a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
        }
        /* Return Namespaces w/ Nested Containers */
        return (function(nsContainers, username) {
          var sortedNSContainers = [];
          /* User's Containers Appear in First Section */
          for (var i = 0; i < nsContainers.length; i++) {
            if (nsContainers[i].namespace === username) {
              sortedNSContainers.push(nsContainers[i]);
              nsContainers.splice(i, 1);
              break;
            }
          }
          return sortedNSContainers.concat(
            nsContainers.sort(function(a, b) {
              if (a.namespace < b.namespace) return -1;
              if (a.namespace > b.namespace) return 1;
              return 0;
            })
          );
        })(nsContainers, username);
      };

      $scope.selectContainer = function(containerId) {
        for (var i = 0; i < $scope.containers.length; i++) {
          if ($scope.containers[i].id === containerId) {
            $scope.selContainerObj = $scope.containers[i];
            break;
          }
        }
      };

      $scope.updateNSContainersRegistered = function(containerObj) {
        for (var i = 0; i < $scope.nsContainers.length; i++) {
          for (var j = 0; j < $scope.nsContainers[i].containers.length; j++) {
            if ($scope.nsContainers[i].containers[j].id === containerObj.id) {
              $scope.nsContainers[i].containers[j].is_registered = containerObj.is_registered;
              return;
            }
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
            TokenService.getUserToken($scope.userObj.id, 'quay.io')
              .then(function(tokenObj) {
                $scope.nsContainers = $scope.sortNSContainers(containers, tokenObj.username);
                if ($scope.nsContainers.length > 0) {
                  $scope.selectContainer($scope.nsContainers[0].containers[0].id);
                }
              });
          },
          function(response) {
            var message = '[' + response.status + '] ' + response.statusText;
            NtfnService.popError('Docker User Containers', message);
            return $q.reject(response);
          }
        );

      $scope.updateContainerObj = function() {
        $scope.updateNSContainersRegistered($scope.selContainerObj);
      };

  }]);

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
    '$timeout',
    'ContainerService',
    'UserService',
    'TokenService',
    'NotificationService',
    function ($scope, $q, $window, $auth, $timeout,
        ContainerService, UserService, TokenService, NtfnService) {

      $scope.userObj = UserService.getUserObj();
      $scope.activeTabs = [true];
      //there are 5 tabs, and only 1 tab can be active
      //so there are 4 tabs that are not active
      var notActiveTabs = 4;
      for (var i = 0; i < notActiveTabs; i++) $scope.activeTabs.push(false);

      $scope.listUserContainers = function(userId) {
        $scope.setContainerEditorError(null);
        return ContainerService.getUserContainerList(userId)
          .then(
            function(containers) {
              $scope.containers = containers;
              return containers;
            },
            function(response) {
              $scope.setContainerEditorError(
                'The webservice encountered an error trying to load a list ' +
                'of containers for this account.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.refreshUserContainers = function(userId) {
        if ($scope.refreshingContainers) return;
        $scope.refreshingContainers = true;
        $scope.setContainerEditorError(null);
        return ContainerService.refreshUserContainers(userId)
          .then(
            function(containers) {
              $window.location.href = '/my-containers';
              return containers;
            },
            function(response) {
              $scope.setContainerEditorError(
                'The webservice encountered an error trying to refresh ' +
                'containers for User: ' + $scope.userObj.username + '. If the ' +
                'problem persists after 60 min. has passed, try re-linking ' +
                'your external accounts and repeating the action.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          ).finally(function(response) {
            $scope.refreshingContainers = false;
          });
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
          var prefix = containers[i].tool_path.split('/',2).join('/');
          var pos = getNSIndex(prefix);
          if (pos < 0) {
            nsContainers.push({
              namespace: prefix,
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
          var unIndex = -1; // username (user's personal containers)
          var orIndex = -1; // 'Others' (i.e. no namespace)
          var orNSObj = null;
          for (var i = 0; i < nsContainers.length; i++) {
            if (nsContainers[i].namespace === username) {
              unIndex = i;
              sortedNSContainers.push(nsContainers[i]);
            } else if (nsContainers[i].namespace === '_') {
              orIndex = i;
              orNSObj = {
                namespace: 'Others',
                containers: nsContainers[i].containers
              };
            }
          }
          if (unIndex >= 0) nsContainers.splice(unIndex, 1);
          if (orIndex >= 0) {
            nsContainers.splice(
              (unIndex < orIndex) ? orIndex - 1: orIndex,
              1
            );
          }
          sortedNSContainers = sortedNSContainers.concat(
            nsContainers.sort(function(a, b) {
              if (a.namespace < b.namespace) return -1;
              if (a.namespace > b.namespace) return 1;
              return 0;
            })
          );
          if (orIndex >= 0) sortedNSContainers.push(orNSObj);

          return sortedNSContainers;
        })(nsContainers, username);
      };

      $scope.openNamespaceItem = function(namespace) {
        for (var i = 0; i < $scope.nsContainers.length; i++) {
          if ($scope.nsContainers[i].namespace === namespace) {
            $scope.nsContainers[i].isOpen = true;
            break;
          }
        }
      };

      $scope.selectContainer = function(containerId) {
        for (var i = 0; i < $scope.containers.length; i++) {
          if ($scope.containers[i].id === containerId) {
            $scope.openNamespaceItem($scope.containers[i].namespace);
            $scope.selContainerObj = $scope.containers[i];
            break;
          }
        }
      };

      $scope.updateNSContainersPublished = function(containerObj) {
        for (var i = 0; i < $scope.nsContainers.length; i++) {
          for (var j = 0; j < $scope.nsContainers[i].containers.length; j++) {
            if ($scope.nsContainers[i].containers[j].id === containerObj.id) {
              $scope.nsContainers[i].containers[j].is_published = containerObj.is_published;
              return;
            }
          }
        }
      };

      $scope.updateContainerTooltips = function() {
        $timeout(function() {
          $('div.ns-containers-accordion [data-toggle="tooltip"]').tooltip();
        }, 200);
      };

      $scope.setContainerEditorError = function(message, errorDetails) {
        if (message) {
          $scope.containerEditorError = {
            message: message,
            errorDetails: errorDetails
          };
        } else {
          $scope.containerEditorError = null;
        }
      };

      if ($auth.isAuthenticated()) {
        TokenService.getUserTokenStatusSet($scope.userObj.id)
          .then(
            function(tokenStatusSet) {
              $scope.tokenStatusSet = tokenStatusSet;
              if (!tokenStatusSet.github) {
                $window.location.href = '/onboarding';
              }
            }
          );
      }

      $scope.listUserContainers($scope.userObj.id)
        .then(
          function(containers) {
            TokenService.getUserToken($scope.userObj.id, 'quay.io')
              .then(
                function(tokenObj) {
                  $scope.quayTokenObj = tokenObj;
                  $scope.nsContainers = $scope.sortNSContainers(
                      containers,
                      tokenObj.username
                  );
                  $scope.updateContainerTooltips();
                  if ($scope.nsContainers.length > 0) {
                    $scope.selectContainer($scope.nsContainers[0].containers[0].id);
                  }
                },
                function(response) {
                  $scope.nsContainers = $scope.sortNSContainers(
                      containers,
                      $scope.userObj.username
                  );
                  $scope.updateContainerTooltips();
                  if ($scope.nsContainers.length > 0) {
                    $scope.selectContainer($scope.nsContainers[0].containers[0].id);
                  }
                }
              );
          });

      $scope.updateContainerObj = function(containerObj, activeTabIndex) {
        if (containerObj) {
          $scope.replaceContainer(containerObj, activeTabIndex);
        } else {
          /* 'Real-time' */
          $scope.updateNSContainersPublished($scope.selContainerObj);
        }
      };

      $scope.getCreateContainerObj = function(namespace) {
        return {
          create: true,
          mode: 'MANUAL_IMAGE_PATH',
          name: '',
          toolname: '',
          namespace: namespace ? namespace.split('/')[1] : '',
          registry: '',
          gitUrl: '',
          default_dockerfile_path: '/Dockerfile',
          default_cwl_path: '/Dockstore.cwl',
          default_wdl_path: '/Dockstore.wdl',
          default_cwl_test_parameter_file: '/test.cwl.json',
          default_wdl_test_parameter_file: '/test.wdl.json',
          is_published: false,
          scrProvider: 'GitHub',
          irProvider: 'Quay.io'
        };
      };

      $scope.addContainer = function(containerObj) {
        $scope.containers.push(containerObj);
        $scope.nsContainers = $scope.sortNSContainers(
          $scope.containers,
          $scope.quayTokenObj ?
              $scope.quayTokenObj.username : $scope.userObj.username
        );
        $scope.updateContainerTooltips();
        $scope.selectContainer(containerObj.id);
        $scope.activeTabs[2] = true;
      };

      $scope.removeContainer = function(containerId) {
        for (var i = 0; i < $scope.containers.length; i++) {
          if ($scope.containers[i].id === containerId) {
            $scope.containers.splice(i, 1);
            break;
          }
        }
        $scope.nsContainers = $scope.sortNSContainers(
          $scope.containers,
          $scope.quayTokenObj ?
              $scope.quayTokenObj.username : $scope.userObj.username
        );
        $scope.updateContainerTooltips();
        if ($scope.nsContainers.length > 0) {
          $scope.selectContainer($scope.nsContainers[0].containers[0].id);
        }
        $scope.activeTabs[0] = true;
      };

      $scope.replaceContainer = function(containerObj, activeTabIndex) {
        for (var i = 0; i < $scope.containers.length; i++) {
          if ($scope.containers[i].id === containerObj.id) break;
        }
        $scope.containers[i] = containerObj;
        $scope.nsContainers = $scope.sortNSContainers(
          $scope.containers,
          $scope.quayTokenObj ?
              $scope.quayTokenObj.username : $scope.userObj.username
        );
        $scope.updateContainerTooltips();
        $scope.selectContainer(containerObj.id);
        $scope.activeTabs[activeTabIndex ? activeTabIndex : 0] = true;
      };

      $scope.$on('deregisterContainer', function(event, containerId) {
        $scope.removeContainer(containerId);
      });

  }]);

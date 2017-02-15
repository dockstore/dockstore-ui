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
 * @ngdoc controller
 * @name dockstore.ui.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('HomeCtrl', [
    '$scope',
    '$rootScope',
    '$q',
    '$location',
    'ContainerService',
    'WorkflowService',
    'UserService',
    'NotificationService',
    function ($scope, $rootScope, $q, $location, ContainerService, WorkflowService, UserService, NtfnService) {
      $(".youtube").colorbox({iframe:true, innerWidth:640, innerHeight:390});

      $scope.userObj = UserService.getUserObj();
      $scope.tabMode = 'Tool';
      $scope.searchQuery = '';

      $scope.selectWorkflowTab = function() {
        $scope.tabMode = 'Workflow';
      };

      $scope.selectToolTab = function() {
        $scope.tabMode = 'Tool';
      };

      $scope.$watch('searchQuery', function(newValue, oldValue) {
        $rootScope.searchQuery = newValue;
      });

      // Random is used to randomize search results since only up to 5 results are shown and we want an even mix of tools and workflows.
      // In the future it would make more sense to use a more relevant metric (ex. most popular, most downloads, etc.)
      $scope.random = function() {
        return 0.5 - Math.random();
      };

      $scope.identifyWorkflow = function(workflows) {
        angular.forEach(workflows, function(obj) {
          obj.entryType = "workflow";
        });
        return workflows;
      };

      $scope.identifyTool = function(tools) {
        angular.forEach(tools, function(obj) {
          obj.entryType = "tool";
        });
        return tools;
      };

      $scope.onSelect = function ($item, $model, $label) {
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
        console.log($item.name);

        if ($item.entryType === "workflow") {
          window.open("/workflows/" + $item.path, "_self");
        } else {
          window.open("/containers/" + $item.tool_path, "_self");
        }
       };

       $scope.printEntry = function(entry) {
        if (entry.entryType === "workflow") {
          return "WORKFLOW " + entry.path;
        } else {
          return "TOOL " + entry.path;
        }
       };


      $scope.listPublishedContainers = function() {
        return ContainerService.getPublishedContainerList()
          .then(
            function(containers) {
              $scope.containers = containers;
            },
            function(response) {
              var message = '[HTTP ' + response.status + '] ' +
                  response.statusText + ': ' + response.data;
              NtfnService.popError('List Published Containers', message);
              return $q.reject(response);
            }
          );
      };

       $scope.listPublishedWorkflows = function() {
              return WorkflowService.getPublishedWorkflowList()
                .then(
                  function(workflows) {
                    $scope.workflows = workflows;
                  },
                  function(response) {
                    var message = '[HTTP ' + response.status + '] ' +
                        response.statusText + ': ' + response.data;
                    NtfnService.popError('List Published Workflows', message);
                    return $q.reject(response);
                  }
                );
            };

      $scope.listPublishedContainers();
      $scope.listPublishedWorkflows();

  }]);

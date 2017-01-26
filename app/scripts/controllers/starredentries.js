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
 * @name dockstore.ui.controller:starredEntries
 * @description
 * # StarredEntriesCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('StarredEntriesCtrl', [
    '$scope',
    '$auth',
    '$location',
    '$window',
    'UserService',
    'NotificationService',
    'ContainerService',
    'WorkflowService',
    'FormattingService',
    function($scope, $auth, $location, $window,
      UserService, NtfnService, ContainerService, WorkflowService, FrmttSrvc) {
      $scope.getGitReposProvider = FrmttSrvc.getGitReposProvider;
      $scope.getGitReposProviderName = FrmttSrvc.getGitReposProviderName;
      $scope.getGitReposWebUrl = FrmttSrvc.getGitReposWebUrl;
      $scope.getImageReposProvider = FrmttSrvc.getImageReposProvider;
      $scope.getImageReposProviderName = FrmttSrvc.getImageReposProviderName;
      $scope.getImageReposWebUrl = FrmttSrvc.getImageReposWebUrl;
      $scope.user = UserService.getUserObj();
      UserService.getStarredWorkflows().then(function(data) {
        $scope.starredWorkflows = data;
        $scope.starredWorkflows.forEach(function(workflow) {
          workflow.gitReposProvider = $scope.getGitReposProvider(
            workflow.gitUrl);
          workflow.gitReposProviderName = $scope.getGitReposProviderName(
            workflow.gitReposProvider);
          workflow.gitReposWebUrl = $scope.getGitReposWebUrl(
            workflow.gitUrl,
            workflow.gitReposProvider);
        });
      });
      UserService.getStarredTools().then(function(data) {
        $scope.starredTools = data;
        $scope.starredTools.forEach(function(tool) {
          tool.gitReposProvider = $scope.getGitReposProvider(
            tool.gitUrl);
          tool.gitReposProviderName = $scope.getGitReposProviderName(
            tool.gitReposProvider);
          tool.gitReposWebUrl = $scope.getGitReposWebUrl(
            tool.gitUrl,
            tool.gitReposProvider);
          /* Image Repository */
          tool.imageReposProviderName = $scope.getImageReposProviderName(
              tool.registry);
          tool.imageReposWebUrl = $scope.getImageReposWebUrl(
              tool.path,
              tool.registry);
        });
      });


      /**
       * @ngdoc method
       * @name isOwner
       * @methodOf dockstore.ui.controller:StarredEntriesCtrl
       * @description
       * This function determines if the current user owns the entry with the given Id
       *
       * @param  {number} entryUsers   The users of the workflow or tool
       * @return {Boolean}       If the user owns the entry given
       */
      $scope.isOwner = function(entryUsers) {
        var isOwner = false;
        entryUsers.forEach(function(user) {
          if (user.id === $scope.user.id  ) {
            isOwner = true;
          }
        });
        return isOwner;
      };
    }
  ]);

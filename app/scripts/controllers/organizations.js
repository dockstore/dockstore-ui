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
 * @name dockstore.ui.controller:StarredCtrl
 * @description
 * # StarredCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('OrganizationsCtrl', [
    '$scope',
    'TokenService',
    '$q',
    function($scope, TokenService, $q) {
      var getOrgs = function() {
        return TokenService.getOrganizations();
      },

      assignTools = function(resultFromApi) {
        $scope.organizations = resultFromApi;
        var promises = [];
        for(var i = 0; i < $scope.organizations.length; i++) {
          var org = $scope.organizations[i];
          var promise = TokenService.getToolsByOrg(org);
          promises.push(promise);
        }
        return $q.all(promises);
      },

      assignWorkflows = function(resultFromApi) {
        $scope.organizations = resultFromApi;
        var promises = [];
        for(var i = 0; i < $scope.organizations.length; i++) {
          var org = $scope.organizations[i];
          var promise = TokenService.getWorkflowsByOrg(org);
          promises.push(promise);
        }
        return $q.all(promises);
      },

      mapTools = function(resultFromApi) {
        var ordered = resultFromApi;
        $scope.orgToTools = {};
        for(var i = 0; i < ordered.length; i++) {
          var tools = ordered[i];
          $scope.orgToTools[$scope.organizations[i]] = tools;
        }
      },

      mapWorkflows = function(resultFromApi) {
        var ordered = resultFromApi;
        $scope.orgToWorkflows = {};
        for(var i = 0; i < ordered.length; i++) {
          var workflows = ordered[i];
          $scope.orgToWorkflows[$scope.organizations[i]] = workflows;
        }
      },

      reportProblems = function(fault) {
        return $q.reject(fault);
      };

      getOrgs()
        .then(assignTools)
          .then(mapTools)
        .catch(reportProblems);

      getOrgs()
        .then(assignWorkflows)
          .then(mapWorkflows)
        .catch(reportProblems);
    }
  ]);

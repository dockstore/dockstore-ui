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
 * @name dockstore.ui.StarringService
 * @description Provides HTTP methods to star or unstar tools and workflows.
 * # StarringService
 * Service in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .service('StarringService', [
    '$q',
    '$http',
    'WebService',
    function($q, $http, WebService) {
      this.getStarring = function(user, entryId, entryType) {
        console.log(WebService.API_URI + '/' + entryType + 's/' + entryId + '/starredUsers');
        return $q(function(resolve, reject) {
          $http({
            method: 'GET',
            url: WebService.API_URI + '/' + entryType + 's/' + entryId + '/starredUsers',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };
      /**
       * @ngdoc function
       * @name setStar
       * @methodOf dockstore.ui.StarringService
       * @description Stars the tool/workflow with the user
       * @param  {obj} user      User object
       * @param  {number} entryId   The ID of the tool/workflow
       * @param  {string} entryType "workflow" or "container"
       * @return {obj}           Reponse object
       */
      this.setStar = function(user, entryId, entryType) {
        return $q(function(resolve, reject) {
          $http({
            method: 'PUT',
            url: WebService.API_URI + '/' + entryType + 's/' + entryId + '/star',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              containerId: entryId,
              workflowId: entryId
            }
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };
      /**
       * @ngdoc method
       * @name setUnstar
       * @methodOf dockstore.ui.StarringService
       * @description
       * Unstars the tool/workflow with the user
       * @param  {obj} user      The user object
       * @param  {number} entryId   The ID of the tool/workflow
       * @param  {string} entryType "workflow" or "container"
       * @return {Obj}           Reponse
       */
      this.setUnstar = function(user, entryId, entryType) {
        return $q(function(resolve, reject) {
          $http({
            method: 'DELETE',
            url: WebService.API_URI + '/' + entryType + 's/' + entryId + '/unstar',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              containerId: entryId,
              workflowId: entryId
            }
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            reject(response);
          });
        });
      };

    }
  ]);

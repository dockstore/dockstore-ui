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
 * @name dockstore.ui.controller:StarringCtrl
 * @description
 * # StarringCtrl
 * Controller of the dockstore.ui
 */

angular.module('dockstore.ui')
  .controller('StarringCtrl', [
    '$scope',
    '$q',
    '$auth',
    'UserService',
    'StarringService',
    'md5',
    function($scope, $q, $auth, UserService, StarringService, md5) {
      $scope.userObj = UserService.getUserObj();
      $scope.max = 1;
      $scope.isReadonly = false;
      $scope.ratingStates = [{
        stateOn: 'glyphicon-star',
        stateOff: 'glyphicon-star-empty'
      }];
      $scope.isLoggedIn = function() {
        return !($scope.userObj === null || $scope.userObj === undefined);
      };
      /**
        * @ngdoc method
        * @name getStarring
        * @methodOf dockstore.ui.controller:StarringCtrl

        * @description

       * This function checks whether the user starred the workflow/tool
       *
       * @param  {Object} userObj   The user object
       * @param  {number} entryId   The ID of the workflow or tool
       * @param  {string} entryType "workflow" or "tool"
       * @return {boolean}           1 if the user starred the workflow or tool,
       *                          0 otherwise.
       */
      $scope.getStarring = function(userObj, entryId, entryType) {
        return StarringService.getStarring(userObj, entryId, entryType)
          .then(
            function(starring) {
              var match = 0;
              starring.forEach(function(star){
                if (star.id === userObj.id) {
                  match = 1;
                }
              });
              return match;

            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to modify labels ' +
                'for this workflow, please ensure that the label list is ' +
                'properly-formatted and does not contain prohibited ' +
                'characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      /**
       * @ngdoc method
       * @name setStarring
       * @methodOf dockstore.ui.controller:StarringCtrl
       * @description
       * This function stars/unstars the workflow/tool and then updates total_stars
       *
       * @param  {Object} userObj   The user object
       * @param  {number} entryId   The ID of the workflow or tool
       * @param  {string} entryType "workflow" or "tool"
       * @return {void}           Void
       */
      $scope.setStarring = function(userObj, entryId, entryType) {
        if ($scope.isLoggedIn) {
          $scope.setStar(userObj, entryId, entryType).then(function(data) {
            $scope.getStarredUsers($scope.userObj, $scope.entryId, $scope.entryType).then(function(data2) {
              $scope.total_stars = data2;
            });
          });
        }

      };

      /**
       * @ngdoc method
       * @name setStar
       * @methodOf dockstore.ui.controller:StarringCtrl
       * @description
       * This function stars/unstars the workflow/tool by the user
       *
       * @param  {Object} userObj   The user object
       * @param  {number} entryId   The ID of the workflow or tool
       * @param  {string} entryType "workflow" or "tool"
       * @return {void}           Void
       */
      $scope.setStar = function(userObj, entryId, entryType) {
        if ($scope.rate === 0) {
          return StarringService.setUnstar($scope.userObj, entryId, entryType);
        } else {
          return StarringService.setStar($scope.userObj, entryId, entryType);
        }
      };

      /**
       * @ngdoc method
       * @name getStarredUsers
       * @methodOf dockstore.ui.controller:StarringCtrl
       * @description
       * This function gets the number of users that starred the workflow or tool
       *
       * @param  {Object} userObj   The user object
       * @param  {number} entryId   The ID of the workflow or tool
       * @param  {string} entryType "workflow" or "tool"
       * @return {number}           The amount of users that starred the workflow or tool
       */
      $scope.getStarredUsers = function(userObj, entryId, entryType) {
        return StarringService.getStarring(userObj, entryId, entryType)
          .then(
            function(starring) {
              return starring.length;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to modify labels ' +
                'for this workflow, please ensure that the label list is ' +
                'properly-formatted and does not contain prohibited ' +
                'characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      /**
       * @ngdoc method
       * @name setDocument
       * @methodOf dockstore.ui.controller:StarringCtrl
       * @description
       * Determines whether we're dealing with workflow or tool
       *
       * @return {type}  description
       */
      $scope.setDocument = function() {
        if ($scope.workflowObj) {
          $scope.entryId = $scope.workflowObj.id;
          $scope.entryType = 'workflow';
        } else {
          $scope.entryId = $scope.containerObj.id;
          $scope.entryType = 'container';
        }
      };
      var gravatarUrl = function(email, defaultImg) {
        if (email) {
          return "https://www.gravatar.com/avatar/" + md5.createHash(email) + "?d=" + defaultImg;
        } else {
          if (defaultImg) {
            return defaultImg;
          } else {
            return "http://www.imcslc.ca/imc/includes/themes/imc/images/layout/img_placeholder_avatar.jpg";
          }
        }
      };
      //const gravatarUrl = (email, defaultImg) => ("https://www.gravatar.com/avatar/" + md5.createHash(email) + "?d=" + defaultImg);
      /**
       * @ngdoc method
       * @name getStargazers
       * @methodOf dockstore.ui.controller:StarringCtrl
       * @description
       * Gets stargazers of this workflow/tool.
       *
       * @param  {number} entryId   Workflow/tool ID
       * @param  {string} entryType "Workflow" or "Tool"
       * @return {string}           None
       */
      $scope.getStargazers = function(entryId, entryType) {
        return StarringService.getStarring($scope.userObj, entryId, entryType)
          .then(
            function(starring) {
              $scope.starGazers.users = starring;
              $scope.starGazers.users.forEach(function(user) {
                user.avatarUrl = gravatarUrl(user.email, user.avatarUrl);
              });
              $scope.starGazers.clicked = true;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to modify labels ' +
                'for this workflow, please ensure that the label list is ' +
                'properly-formatted and does not contain prohibited ' +
                'characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };
    }
  ]);

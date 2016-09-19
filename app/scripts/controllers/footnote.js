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
 * @name dockstore.ui.controller:FootnoteCtrl
 * @description
 * # FootnoteCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('FootnoteCtrl', [
    '$scope',
    '$q',
    'TokenService',
    'NotificationService',
    function ($scope, $q, TokenService, NtfnService) {

      $scope.metadata = function(){
        return TokenService.getWebServiceVersion()
          .then(
            function(resultFromApi) {
              $scope.apiVersion = resultFromApi.version;
              $scope.ga4ghApiVersion = resultFromApi.apiVersion;
            },
            function(response) {
              $scope.apiVersion = "unreachable";
              $scope.ga4ghApiVersion = "unreachable";
              var message = '[HTTP ' + response.status + '] ' +
                response.statusText + ': ' + response.data;
              NtfnService.popError('Metadata', message);
              return $q.reject(response);
            }
          );
      };

      $scope.metadata();

  }]);

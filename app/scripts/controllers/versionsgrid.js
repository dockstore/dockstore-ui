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
 * @name dockstore.ui.controller:VersionsGridCtrl
 * @description
 * # VersionsGridCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('VersionsGridCtrl', [
    '$scope',
    '$q',
    '$sce',
    'ContainerService',
    'FormattingService',
    'NotificationService',
    'UtilityService',
    function ($scope, $q, $sce, ContainerService, FrmttSrvc, NtfnService, UtilityService) {

      $scope.containers = [];
      $scope.sortColumn = 'name';
      $scope.sortReverse = false;

      $scope.getHRSize = FrmttSrvc.getHRSize;
      $scope.getDateModified = FrmttSrvc.getDateModified;
      $scope.gitReferenceTooltip = $sce.trustAsHtml('Git branches/tags<br/> The selected reference and tag will be used to populate <br/>the info tab including "launch with"');

      $scope.clickSortColumn = function(columnName) {
        if ($scope.sortColumn === columnName) {
          $scope.sortReverse = !$scope.sortReverse;
        } else {
          $scope.sortColumn = columnName;
          $scope.sortReverse = false;
        }
      };

      $scope.getIconClass = function(columnName) {
        return UtilityService.getIconClass(columnName, $scope.sortColumn, $scope.sortReverse);
      };

      $scope.deleteTag = function(tagId) {
        $scope.setError(null);
        return ContainerService.deleteContainerTag($scope.containerObj.id, tagId)
          .then(
            function(response) {
              $scope.removeVersionTag(tagId);
              $scope.$emit('tagEditorRefreshContainer', $scope.containerObj.id);
            },
            function(response) {
              $scope.setError(
                'The webservice encountered an error trying to delete this ' +
                'tag, please ensure that the container and the tag both exist.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.addVersionTag = function(tagObj) {
        $scope.versionTags.push(tagObj);
      };

      $scope.removeVersionTag = function(tagId) {
        for (var i = 0; i < $scope.versionTags.length; i++) {
          if ($scope.versionTags[i].id === tagId) {
            $scope.versionTags.splice(i, 1);
            break;
          }
        }
      };

      $scope.getDockerPullCmd = function(path, tagName) {
        return FrmttSrvc.getFilteredDockerPullCmd(path, tagName);
      };

      $scope.getCreateTagObj = function() {
        return {
          create: true,
          name: '',
          reference: '',
          image_id: '',
          dockerfile_path: $scope.containerObj.default_dockerfile_path,
          cwl_path: $scope.containerObj.default_cwl_path,
          wdl_path: $scope.containerObj.default_wdl_path,
          hidden: true,
          automated: false
        };
      };

      $scope.updateDefaultVersion = function(referenceName) {
      $scope.containerObj.defaultValue = referenceName;
        ContainerService.updateDefaultVersion($scope.containerObj.id,$scope.containerObj)
        .then(function(){
          $scope.$parent.refreshContainer($scope.containerObj.id,0);
         });
      };
  }]);

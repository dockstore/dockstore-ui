'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:TagEditorCtrl
 * @description
 * # TagEditorCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('TagEditorCtrl', [
    '$scope',
    'ContainerService',
    'FormattingService',
    function ($scope, ContainerService, FrmttSrvc) {
    
      $scope.getHRSize = FrmttSrvc.getHRSize;
      $scope.getDateTimeString = FrmttSrvc.getDateTimeString;

      $scope.saveTagChanges = function() {
        return ContainerService.updateContainerTag($scope.containerId, $scope.tagObj)
          .then(
            function(versionTags) {
              console.log(versionTags);
              // $scope.containers = containers;
              return versionTags;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('Update Container Tags', message);
              return $q.reject(response);
            }
          );
      };

  }]);

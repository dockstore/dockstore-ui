'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:VersionTagEditorCtrl
 * @description
 * # VersionTagEditorCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('VersionTagEditorCtrl', [
    '$scope',
    '$q',
    'WorkflowService',
    'FormattingService',
    'NotificationService',
    function ($scope, $q, WorkflowService, FrmttSrvc, NtfnService) {

      $scope.getDateTimeString = FrmttSrvc.getDateTimeString;

      $scope.saveVersionTagChanges = function() {
        if ($scope.savingActive) return;
        $scope.savingActive = true;
        return WorkflowService.updateWorkflowVersionTag($scope.workflowId, $scope.versionTagObj)
          .then(
            function(versionTags) {
              $scope.closeEditVersionTagModal(true);
              $scope.$emit('versionTagEditorRefreshWorkflow', $scope.workflowId);
              return versionTags;
            },
            function(response) {
              $scope.setVersionTagEditError(
                'The webservice encountered an error trying to save this ' +
                'workflow, please ensure that the workflow exists and the ' +
                'workflow version attributes are valid.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          ).finally(function(response) {
            $scope.savingActive = false;
          });
      };

      $scope.closeEditVersionTagModal = function(toggle) {
        $scope.setVersionTagEditError(null);
        $scope.versionTagEditorForm.$setUntouched();
        if (toggle) $scope.toggleModal = true;
      };

      $scope.setVersionTagEditError = function(message, errorDetails) {
        if (message) {
          $scope.versionTagEditError = {
            message: message,
            errorDetails: errorDetails
          };
        } else {
          $scope.versionTagEditError = null;
        }
      };

      $scope.setVersionTagEditError(null);

  }]);

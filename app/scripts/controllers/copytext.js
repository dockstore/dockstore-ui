'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:CopyTextCtrl
 * @description
 * # CopyTextCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('CopyTextCtrl', [
    '$scope',
    'NotificationService',
    function ($scope, NtfnService) {

      $scope.ntfyCopySuccess = function(message) {
        NtfnService.popSuccess('Copy Success', message);
      };

      $scope.ntfyCopyFailure = function(message) {
        NtfnService.popFailure('Copy Failure', message);
      };

  }]);

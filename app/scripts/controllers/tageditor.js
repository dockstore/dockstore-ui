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
    'FormattingService',
    function ($scope, FrmttSrvc) {
    
      $scope.getHRSize = FrmttSrvc.getHRSize;
      $scope.getDateModified = FrmttSrvc.getDateModified;

      
  }]);

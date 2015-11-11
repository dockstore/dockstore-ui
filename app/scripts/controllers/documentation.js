'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:DocumentationCtrl
 * @description
 * # DocumentationCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('DocumentationCtrl', [
    '$scope',
    'DocumentationService',
    function ($scope, DocumentationService) {

      $scope.docObjs = DocumentationService.getDocumentObjs();

  }]);

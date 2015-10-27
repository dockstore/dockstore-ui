'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:DocumentCtrl
 * @description
 * # DocumentCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('DocumentCtrl', [
    '$scope',
    '$routeParams',
    '$location',
    'DocumentationService',
    function ($scope, $routeParams, $location, DocumentationService) {

      $scope.docObj = (function(docObjs, urlSlug) {
        for (var i = 0; i < docObjs.length; i++) {
          if (docObjs[i].slug === urlSlug) return docObjs[i];
        }
        return null;
      })(DocumentationService.getDocumentObjs(), $routeParams.urlSlug);

      if (!$scope.docObj) $location.path('/docs');

  }]);

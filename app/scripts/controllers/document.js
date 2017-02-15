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
 * @ngdoc controller
 * @name dockstore.ui.controller:DocumentCtrl
 * @description
 * # DocumentCtrl
 * Controller of the dockstore.ui
 */

 /*global Toc*/
angular.module('dockstore.ui')
  .controller('DocumentCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    '$anchorScroll',
    'DocumentationService',
    function ($scope, $location, $routeParams, $anchorScroll, DocumentationService) {
      $scope.docObj = (function(docObjs, urlSlug) {
        for (var i = 0; i < docObjs.length; i++) {
          if (docObjs[i].slug === urlSlug) return docObjs[i];
        }
        return null;
      })(DocumentationService.getDocumentObjs(), $routeParams.urlSlug);

      if (!$scope.docObj) $location.path('/docs');

      $scope.$on("finishedLoading", function(event) {
          var url = $location.absUrl().split('#')[1];
          $location.hash(url);
          $anchorScroll();
          var navSelector = '#toc';
          var $myNav = $(navSelector);
            $('body').scrollspy({
               target: navSelector
            });
            Toc.init({
              $nav: $myNav,
              $scope: $('#doc')
            });
            event.preventDefault();
      });
  }]);

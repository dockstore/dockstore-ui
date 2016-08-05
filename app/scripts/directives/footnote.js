'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:footnote
 * @description
 * # footnote
 */
angular.module('dockstore.ui')
  .directive('footnote', function () {
    return {
      restrict: 'AE',
      controller: 'FootnoteCtrl',
      templateUrl: 'templates/footnote.html',
      link: function postLink(scope, element, attrs) {

      }
    };
  });

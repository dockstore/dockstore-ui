'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:tagEditor
 * @description
 * # tagEditor
 */
angular.module('dockstore.ui')
  .directive('tagEditor', function () {
    return {
      restrict: 'AE',
      controller: 'TagEditorCtrl',
      templateUrl: 'templates/tageditor.html',
      link: function postLink(scope, element, attrs) {
        // element.text('this is the tagEditor directive');
      }
    };
  });

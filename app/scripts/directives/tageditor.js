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
      scope: {
      	tagObj: '=',
      	containerPath: '@',
      	editMode: '='
      },
      templateUrl: 'templates/tageditor.html',
      link: function postLink(scope, element, attrs) {
      	scope.editTagObj = angular.copy(scope.tagObj);
        // element.text('this is the tagEditor directive');
      }
    };
  });

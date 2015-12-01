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
        containerId: '@',
      	containerPath: '@',
      	editMode: '='
      },
      templateUrl: 'templates/tageditor.html',
      link: function postLink(scope, element, attrs) {
      	//scope.editTagObj = angular.copy(scope.tagObj);
      }
    };
  });

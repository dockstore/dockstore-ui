'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:versionsGrid
 * @description
 * # versionsGrid
 */
angular.module('dockstore.ui')
  .directive('versionsGrid', function () {
    return {
      restrict: 'AE',
      controller: 'VersionsGridCtrl',
      controllerAs: 'VersionsGrid',
      scope: {
      	containerObj: '=',
        editMode: '=',
        setError: '='
      },
      templateUrl: 'templates/versionsgrid.html',
      link: function postLink(scope, element, attrs) {
        scope.$watch('containerObj',
          function(newVal, oldVal, scope) {
            if (newVal) {
              scope.versionTags = scope.containerObj.tags;
            }
        }, true);
      }
    };
  });

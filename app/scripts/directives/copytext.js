'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:copyText
 * @description
 * # copyText
 */
angular.module('dockstore.ui')
  .directive('copyText', function () {
    return {
      restrict: 'AE',
      controller: 'CopyTextCtrl',
      scope: {
        copyText: '@value',
        length: '@'
      },
      templateUrl: 'templates/copytext.html',
      link: function postLink(scope, element, attrs) {
        $(element).find('input').on('click', function() {
          this.select();
        });
        $(element).find('button').on('click', function() {
          $(element).find('input').select();
          try {
            if (document.execCommand('copy')) {
              scope.ntfyCopySuccess('Docker command copied to clipboard.');
            } else {
              scope.ntfyCopyFailure('Clipboard copy was unsuccessul, please ' +
                'retry using the OS copy command.');
            }
          } catch (error) {
            scope.ntfyCopyFailure(error);
          }
        });
      }
    };
  });

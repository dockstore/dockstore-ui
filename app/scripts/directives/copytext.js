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
      transclude: true,
      scope: {
        type: '@',
        length: '@',
        value: '='
      },
      templateUrl: 'templates/copytext.html',
      link: function postLink(scope, element, attrs) {
        var copySelection = function() {
          try {
            if (document.execCommand('copy')) {
              scope.ntfyCopySuccess();
            } else {
              scope.ntfyCopyFailure('Clipboard copy was unsuccessul, please ' +
                'retry using the OS copy command.');
            }
          } catch (error) {
            scope.ntfyCopyFailure(error);
          }
        };

        var intervalId = setInterval(function() {
          var text = $(element).find('[ng-transclude] > span').html();
          if (text && text.length > 0) {
            window.clearInterval(intervalId);
          } else if (scope.value && scope.value.length > 0) {
            text = scope.value;
            window.clearInterval(intervalId);
            scope.$watch('value', function(newValue, oldValue) {
              if (newValue) $(element).find('input').val(newValue);
            });
          } else {
            return;
          }

          if (scope.type === 'textarea') {
            $(element).find('textarea').val(text);
            $(element).find('textarea').on('focus', function() {
              this.select();
            });
            $(element).find('span.btn').on('click', function() {
              $(element).find('textarea').select();
              copySelection();
            });
          } else {
            $(element).find('input').val(text);
            $(element).find('input').on('focus', function() {
              this.select();
            });
            $(element).find('span.btn').on('click', function() {
              $(element).find('input').select();
              copySelection();
            });
          }
        }, 10);

      }
    };
  });

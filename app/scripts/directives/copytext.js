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
              scope.ntfyCopyFailure('Clipboard copy was unsuccessful, please ' +
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

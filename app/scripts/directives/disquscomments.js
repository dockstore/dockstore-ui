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
 * @name dockstore.ui.directive:disqusComments
 * @description
 * # disqusComments
 */
angular.module('dockstore.ui')
  .directive('disqusComments', function () {
    return {
      restrict: 'AE',
      template: '<div id="discourse-comments"></div>',
      link: function postLink(scope, element, attrs) {
        window.DiscourseEmbed = { discourseUrl: 'https://discuss.dockstore.org/',
                           discourseEmbedUrl: window.location.href + '/'};
  (function() {
    var d = document.createElement('script'); d.type = 'text/javascript'; d.async = true;
    d.src = DiscourseEmbed.discourseUrl + 'javascripts/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(d);
  })();
      }
    };
  });

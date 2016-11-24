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
 * @ngdoc function
 * @name dockstore.ui.controller:FileViewerCtrl
 * @description
 * # FileViewerCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('FileViewerCtrl', [
    '$scope',
    '$q',
    'NotificationService',
    function ($scope, $q, NtfnService) {
      $scope.setupLineNumbers = function () {
        var selectedElement = $('*[type="file-viewer"] > pre')[0];
        var className = "line-number";

        if (selectedElement !== undefined) {
          if (selectedElement.children.length === 1) {
            // Insert line num span
            var lineNumSpan = document.createElement("SPAN");
            var closeSpan = document.createElement("SPAN");
            selectedElement.appendChild(closeSpan);
            selectedElement.insertBefore(lineNumSpan, selectedElement.children[0]);

            // Setup attributes
            lineNumSpan.setAttribute("class", className);
            closeSpan.setAttribute("class", "cl");
          }
        }
        $scope.addLineNumbers();
      };

      $scope.addLineNumbers = function(){
        // Get line numbers node and total line numbers
        var lineNumNode = $('.line-number');
        var totalLines = $scope.totalLines;

        // Remove any existing line numbers
        lineNumNode.children().remove();

        // Add the line numbers beside the descriptor file
        for (var i = 1; i < totalLines; i++) {
          var line = document.createElement("SPAN");
          line.innerHTML = i;
          $(lineNumNode).append(line);
        }
      };


      $scope.setDocument = function() {
        $scope.totalLines = $scope.fileContents.split(/\n/).length;
        $scope.setupLineNumbers();
      };

      $scope.onSuccess = function(e) {
        e.clearSelection();
        NtfnService.popSuccess('Copy Success');
      };

      $scope.onError = function(e) {
        NtfnService.popFailure('Copy Failure');
      };
  }]);

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
 * @name dockstore.ui.controller:WorkflowFileViewerCtrl
 * @description
 * # WorkflowFileViewerCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('WorkflowFileViewerCtrl', [
    '$scope',
    '$q',
    'WorkflowService',
    'NotificationService',
    function ($scope, $q, WorkflowService, NtfnService) {

      $scope.descriptor = $scope.workflowObj.descriptorType;
      $scope.fileLoaded = false;
      $scope.fileContents = null;
      $scope.successContent = [];
      $scope.fileTabs = ['descriptor', 'testparameter'];

      $scope.setupLineNumbers = function () {
        var selectedElement = $('*[type="workflow-file-viewer"] > pre')[0];
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

      $scope.setType = function(type) {
        $scope.type = type;
        $scope.refreshDocument(false);
      };

      $scope.checkDescriptor = function() {
        $scope.workflowVersions = $scope.getWorkflowVersions();
        if ($scope.workflowVersions.length === 0){
          return;
        }
        $scope.successContent = [];
        $scope.fileContents = null;
        var accumulator = [];
        var index = 0;
        var m = [];
        var v = false;
        var invalidClass = false;
        var count = 0;
        var cwlFields = ["inputs","outputs","steps","class"];
        var wdlFields = ["task","output","workflow","command","call"];
        for (var i=0; i<$scope.workflowVersions.length; i++) {
            accumulator[index] = {
              ver: $scope.workflowVersions[i],
              content: null
            };
            index++;
        }

        var checkSuccess = function(acc) {
          var makePromises = function(acc, start) {
            var vd = acc[start];
            function filePromise(vd){
              return $scope.getDescriptorFile($scope.workflowObj.id, vd.ver, $scope.descriptor).then(
                function(s){
                  $scope.successContent.push({
                    version:vd.ver,
                    content: s
                  });

                  if(start+1 === acc.length) {
                    return {success: true, index:start};
                  } else{
                    start++;
                    return filePromise(acc[start]);
                  }
                },
                function(e){
                  if (start+1 === acc.length) {
                    return {success: false, index:start};
                  } else {
                    start++;
                    return filePromise(acc[start]);
                  }
                });
            }
            return filePromise(vd);
          };
          return makePromises(acc,0);
        };

        var successResult = checkSuccess(accumulator);
        successResult.then(
          function(r){
            var isVersionValid = false;
            if ($scope.successContent.length !== 0) {
              if ($scope.workflowObj.defaultVersion === null) {
                $scope.selVersionName = $scope.successContent[0].version;
                $scope.fileContents = $scope.successContent[0].content;
              } else {
                for (var counter = 0; counter < $scope.successContent.length; counter++) {
                  if ($scope.successContent[counter].version === $scope.workflowObj.defaultVersion) {
                    $scope.selVersionName = $scope.successContent[counter].version;
                    $scope.fileContents = $scope.successContent[counter].content;
                    isVersionValid = true;
                    break;
                  }
                }
                if (!isVersionValid) {
                  $scope.selVersionName = $scope.successContent[0].version;
                  $scope.fileContents = $scope.successContent[0].content;
                }
              }
            }

            var result = $scope.fileContents;
            m = [];
            v = false;
            count = 0;
            if (result !== null){

            if($scope.descriptor === "cwl"){
              //Descriptor: CWL
              for(var i=0;i<cwlFields.length;i++){
                if(result.search(cwlFields[i]) !==-1){
                  if(cwlFields[i] === 'class'){
                    if(result.search("CommandLineTool") !== -1 && result.search("Workflow") === -1){
                      //class is CommandLineTool instead of Workflow, this is invalid!
                      invalidClass = true;
                      break;
                    }
                  }
                  count++;
                } else{
                  m.push(cwlFields[i]);
                }
              }

              if(result.search("cwlVersion:")===-1){
                m.push('cwlVersion');
              }

              if(count===4){
                v = true;
              }
              $scope.$emit('invalidClass', invalidClass); //only for CWL
            } else{
              //Descriptor: WDL
              for(var w=0;w<wdlFields.length;w++){
                if(result.search(wdlFields[w]) !==-1){
                  count++;
                } else{
                  m.push(wdlFields[w]);
                }
              }

              if(count===5){
                v = true;
              }
            }

            $scope.totalLines = result.split(/\n/).length;
            $scope.setupLineNumbers('descriptor');
            $scope.$emit('returnMissing',m);
            $scope.$emit('returnValid',v);
            }
          },
          function(e){
            console.log("error get success result",e);
          });

      };

      $scope.filterVersion = function(element) {
        for(var i=0;i<$scope.successContent.length;i++){
          if($scope.successContent[i].version === element){
            return true;
          } else{
            if(i===$scope.successContent.length -1){
              return false;
            }
          }
        }
      };

      $scope.isTestParameter = function() {
        return $scope.type === 'testparameter';
      };

      $scope.getWorkflowVersions = function() {
        var sortedVersionObjs = $scope.workflowObj.workflowVersions;
        sortedVersionObjs.sort(function(a, b) {
          if (a.name === 'master') return -1;
          if ((new RegExp(/[a-zA-Z]/i).test(a.name.slice(0, 1))) &&
                (new RegExp(/[^a-zA-Z]/i).test(b.name.slice(0, 1)))) return -1;
          /* Lexicographic Sorting */
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        var versions = [];
        for (var i = 0; i < sortedVersionObjs.length; i++) {
          if (!sortedVersionObjs[i].hidden) {
            versions.push(sortedVersionObjs[i].name);
          }
        }
        return versions;
      };

      $scope.getDescriptorFile = function(workflowId, versionName, type) {
        return WorkflowService.getDescriptorFile(workflowId, versionName, type)
          .then(
            function(descriptorFile) {
              // this causes flicker when loading
              //$scope.fileContents = descriptorFile; //if this is not commented, it will last file that's uploaded despite it's version is wrong
              return descriptorFile;
            },
            function(response) {
              return $q.reject(response);
            }
          ).finally(
            function() { $scope.fileLoaded = true; }
          );
      };

      $scope.getSecondaryDescriptorFile = function(containerId, tagName, type, secondaryDescriptorPath) {
        if(typeof $scope.selVersionName === 'undefined' || typeof $scope.selSecondaryDescriptorName === 'undefined'){
          return;
        }
        return WorkflowService.getSecondaryDescriptorFile(containerId, tagName, type, encodeURIComponent(secondaryDescriptorPath))
          .then(
            function (descriptorFile) {
              $scope.fileContents = descriptorFile;
              return descriptorFile;
            },
            function (response) {
              return $q.reject(response);
            }
          ).finally(
            function () {
              $scope.fileLoaded = true;
            }
          );
      };

      $scope.getTestParameterFile = function(workflowId, versionName) {
        return WorkflowService.getTestJson(workflowId, versionName)
          .then(
            function(testJson) {
              $scope.fileContents = testJson;
              return testJson;
            },
            function(response) {
              return $q.reject(response);
            }
          )
          .finally(
            function() {
              $scope.fileLoaded = true;
            }
          );
      };

      function extracted(){
        try {
          return $scope.workflowObj.workflowVersions.filter(function (a) {
            return a.name === $scope.selVersionName;
          })[0].sourceFiles.filter(function (a) {
            return a.type === 'DOCKSTORE_' + $scope.descriptor.toUpperCase();
          }).map(function (a) {
            return a.path;
          }).sort();
        } catch(err){
          return [];
        }
      }

      $scope.setDocument = function() {
        $scope.descriptor = $scope.workflowObj.descriptorType;
        // prepare Workflow Version drop-down
        $scope.workflowVersions = $scope.workflowObj.workflowVersions.map(function(a) {return a.name;}).sort();
        $scope.selVersionName = $scope.workflowVersions[0];
        // prepare Descriptor Imports drop-down
        $scope.secondaryDescriptors = extracted();
        $scope.selSecondaryDescriptorName = $scope.secondaryDescriptors[0];
      };

      $scope.refreshDocument = function(versionChange) {
        $scope.fileLoaded = false;
        $scope.fileContents = null;
        switch ($scope.type) {
          case 'descriptor':
            $scope.expectedFilename = 'Descriptor';
            $scope.secondaryDescriptors = extracted();
            if (versionChange === true) {
                $scope.selSecondaryDescriptorName = $scope.secondaryDescriptors[0];
            }
            var descriptor = $scope.getSecondaryDescriptorFile($scope.workflowObj.id, $scope.selVersionName, $scope.descriptor, $scope.selSecondaryDescriptorName);
            if (descriptor) {
              descriptor.then(
              function(s){
                $scope.totalLines = s.split(/\n/).length;
                $scope.setupLineNumbers();
              },
                function(e){
//                console.log("error refreshDocument",e);
              });
              }
              break;
          case 'testparameter':
            $scope.expectedFilename = 'Test Parameter File';
            var testparameter = $scope.getTestParameterFile($scope.workflowObj.id, $scope.selVersionName);
            if (testparameter) {
              testparameter.then(
              function(s){
                $scope.totalLines = s.split(/\n/).length;
                $scope.setupLineNumbers();
              },
                function(e){
//                console.log("error refreshDocument",e);
              });
              }
              break;
          default:
            // ...
            }
      };

      $scope.onSuccess = function(e) {
        e.clearSelection();
      };

      $scope.setDocument();

  }]);

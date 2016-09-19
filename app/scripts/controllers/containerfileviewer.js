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
 * @name dockstore.ui.controller:ContainerFileViewerCtrl
 * @description
 * # ContainerFileViewerCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('ContainerFileViewerCtrl', [
    '$scope',
    '$q',
    'ContainerService',
    'NotificationService',
    function ($scope, $q, ContainerService) {

      var descriptors = ["cwl", "wdl"];

      $scope.fileLoaded = false;
      $scope.fileContents = null;
      $scope.successContent = [];
      $scope.fileContent = null;

      $scope.addLineNumbers = function(type){
        //get line numbers node and total line numbers
        var lineNumNode = document.getElementsByClassName('line-number-desc');
        var lineNumLength = $('.line-number-desc').children().length;
        var totalLines = $scope.totalLinesDesc;

        if(type === 'dockerfile'){
          lineNumNode = document.getElementsByClassName('line-number-dockerfile');
          lineNumLength = $('.line-number-dockerfile').children().length;
          totalLines = $scope.totalLinesDf;
        }
        //reset line numbers for new file by removing the nodes of line numbers
        if(lineNumLength > 0){
          while(lineNumNode[0].firstChild){
            lineNumNode[0].removeChild(lineNumNode[0].firstChild);
          }
        }
        //add the line numbers beside the descriptor file
        for (var i = 1; i < totalLines; i++) {
          var line = document.createElement("SPAN");
          line.innerHTML = i;
          $(lineNumNode).append(line);
        }
      };

      $scope.getContentHTML = function (type) {
        var selectedElement;
        var className;
        if (type === 'descriptor') {
          selectedElement = $('*[type="container-file-viewer-descriptor"] > pre')[0];
          className = "line-number-desc";
        } else if (type === 'dockerfile') {
          selectedElement = $('*[type="container-file-viewer-dockerfile"] > pre')[0];
          className = "line-number-dockerfile";
        }
        if (selectedElement.children.length === 1) {
          // have not inserted line number span yet
          var lineNumSpan = document.createElement("SPAN");
          var closeSpan = document.createElement("SPAN");
          selectedElement.appendChild(closeSpan);
          selectedElement.insertBefore(lineNumSpan, selectedElement.children[0]);
          //set id and classes
          lineNumSpan.setAttribute("class", className);
          closeSpan.setAttribute("class", "cl");
        }
        $scope.addLineNumbers(type);
      };

      $scope.checkDockerfile = function() {
        var dockerfile = $scope.getDockerFile($scope.containerObj.id, $scope.selTagName);
        if(dockerfile !== undefined){
          dockerfile.then(function(s){
            $scope.totalLinesDf = s.split(/\n/).length;
            $scope.getContentHTML("dockerfile");
          },
          function(e){
            console.log("error refreshDocument",e);
          });
        }
      };

      $scope.checkDescriptor = function() {
        $scope.containerTags = $scope.getContainerTags();
        $scope.successContent = [];
        $scope.fileContent = null;
        var accumulator = [];
        var index = 0;
        var m = [];
        var v = false;
        var invalidClass = false;
        var count = 0;
        var cwlFields = ["inputs","outputs","baseCommand","class"];
        var wdlFields = ["task","output","workflow","command","call"];
        for (var i=0; i<$scope.containerTags.length; i++) {
          for (var j=0; j<descriptors.length; j++) {
            accumulator[index] = {
              tag: $scope.containerTags[i],
              desc: descriptors[j],
              content: null
            };
            index++;
          }
        }

        var checkSuccess = function(acc) {
          var makePromises = function(acc, start) {
            var vd = acc[start];
            function filePromise(vd){
              return $scope.getDescriptorFile($scope.containerObj.id, vd.tag, vd.desc).then(
                function(s){
                  $scope.successContent.push({
                    tag:vd.tag,
                    descriptor:vd.desc,
                    content:s
                  });
                  if(start+1 === acc.length) {
                    return {success: true, index:start};
                  } else{
                    start++;
                    return filePromise(acc[start]);
                  }
                },
                function(){
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
          function(){
            var isVersionValid = false;
            if ($scope.successContent.length !== 0) {
              if ($scope.containerObj.defaultVersion === null) {
                $scope.selTagName = $scope.successContent[0].tag;
                $scope.selDescriptorName = $scope.successContent[0].descriptor;
                $scope.fileContent = $scope.successContent[0].content;
              } else {
                for (var counter = 0; counter < $scope.successContent.length; counter++) {
                  if ($scope.successContent[counter].tag === $scope.containerObj.defaultVersion) {
                    $scope.selTagName = $scope.successContent[counter].tag;
                    $scope.selDescriptorName = $scope.successContent[counter].descriptor;
                    $scope.fileContent = $scope.successContent[counter].content;
                    isVersionValid = true;
                    break;
                  }
                }
                if(!isVersionValid) {
                  $scope.selTagName = $scope.successContent[0].tag;
                  $scope.selDescriptorName = $scope.successContent[0].descriptor;
                  $scope.fileContent = $scope.successContent[0].content;
                }
              }
            }

            var result = $scope.fileContent;
            m = [];
            v = false;
            invalidClass = false;
            count = 0;
            if($scope.selDescriptorName === "cwl"){
              //Descriptor: CWL
              for(var i=0;i<cwlFields.length;i++){
                if(result.search(cwlFields[i]) !==-1){
                  if(cwlFields[i] === 'class'){
                    if(result.search("CommandLineTool") === -1 && result.search("Workflow") !== -1){
                      //class is Workflow instead of CommandLineTool, this is invalid!
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
            //$scope.getContentHTML('descriptor');
            $scope.$emit('returnMissing',m);
            $scope.$emit('returnValid',v);
            $scope.refreshDocumentType();
          },
          function(e){
            console.log("error",e);
          });
      };

      $scope.filterDescriptor = function(element) {
        for(var i=0;i<$scope.successContent.length;i++){
          if($scope.successContent[i].descriptor === element){
            return true;
          } else{
            if(i===$scope.successContent.length -1){
              return false;
            }
          }
        }
      };

      $scope.filterVersion = function(element) {
        for(var i=0;i<$scope.successContent.length;i++){
          if($scope.successContent[i].tag === element){
            return true;
          } else{
            if(i===$scope.successContent.length -1){
              return false;
            }
          }
        }
      };

      $scope.isDockerfile = function() {
        return $scope.type === 'dockerfile';
      };

      $scope.getContainerTags = function() {
        var sortedTagObjs = $scope.containerObj.tags;
        sortedTagObjs.sort(function(a, b) {
          if (a.name === 'latest') return -1;
          if ((new RegExp(/[a-zA-Z]/i).test(a.name.slice(0, 1))) &&
                (new RegExp(/[^a-zA-Z]/i).test(b.name.slice(0, 1)))) return -1;
          /* Lexicographic Sorting */
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        var tags = [];
        for (var i = 0; i < sortedTagObjs.length; i++) {
          if (!sortedTagObjs[i].hidden) {
            tags.push(sortedTagObjs[i].name);
          }
        }
        return tags;
      };

      $scope.getDockerFile = function(containerId, tagName) {
        return ContainerService.getDockerFile(containerId, tagName)
          .then(
            function(dockerFile) {
              $scope.fileContents = dockerFile;
              return dockerFile;
            },
            function(response) {
              return $q.reject(response);
            }
          )
          .finally(
            function() { $scope.fileLoaded = true; }
          );
      };

      $scope.getDescriptorFile = function(containerId, tagName, type) {
        return ContainerService.getDescriptorFile(containerId, tagName, type)
          .then(
            function(descriptorFile) {
              // this seems to cause flickr when loading
              // $scope.fileContents = descriptorFile;
              return descriptorFile;
            },
            function(response) {
              return $q.reject(response);
            }
          ).finally(
            function() { $scope.fileLoaded = true; }
          );
      };

      $scope.getDescriptorFilePath = function(containerId, tagName, type) {
        return ContainerService.getDescriptorFilePath(containerId, tagName, type)
          .then(
            function(descriptorFile) {
              $scope.secondaryDescriptors = $scope.secondaryDescriptors.concat(descriptorFile);
              $scope.secondaryDescriptors = $scope.secondaryDescriptors.filter(
                function(elem, index, self){
                  return index === self.indexOf(elem);
              });
              return $scope.secondaryDescriptors;
            },
            function(response) {
              return $q.reject(response);
            }
          ).finally(
            function() { $scope.fileLoaded = true; }
          );
      };

      $scope.getSecondaryDescriptorFile = function(containerId, tagName, type, secondaryDescriptorPath) {
        if(typeof tagName === 'undefined' || typeof secondaryDescriptorPath === 'undefined'){
          return;
        }
        return ContainerService.getSecondaryDescriptorFile(containerId, tagName, type, encodeURIComponent(secondaryDescriptorPath))
          .then(
            function(descriptorFile) {
              $scope.fileContents = descriptorFile;
              return descriptorFile;
            },
            function(response) {
              return $q.reject(response);
            }
          ).finally(
            function() { $scope.fileLoaded = true; }
          );
      };

      /**
       * This extracts a list of valid secondary files for a given tool, filtered by the selected tag and descriptor type
       * Returns an empty array if there are not valid tags
       */
      function extracted(){
        if($scope.containerObj.tags.length !==0){
          return $scope.containerObj.tags.filter(
            function(a) {
              return a.name === $scope.selTagName;})[0].sourceFiles.filter(
              function(a) {
                return a.type === 'DOCKSTORE_'+$scope.selDescriptorName.toUpperCase();}).map(
                function(a) {
                  return a.path;
                }).sort();
        }else{
          return [];
        }

      }

      $scope.setDocument = function() {
        // prepare Container Version drop-down
        $scope.containerTags = $scope.getContainerTags();
        $scope.selTagName = $scope.containerTags[0];
        // prepare Descriptor Type drop-down
        $scope.descriptors = descriptors;
        $scope.selDescriptorName = descriptors[0];
        // prepare Descriptor Imports drop-down
        $scope.secondaryDescriptors = extracted();
        $scope.selSecondaryDescriptorName = $scope.secondaryDescriptors[0];
      };

      $scope.refreshDocumentType = function() {
        $scope.fileLoaded = false;
        $scope.fileContents = null;
        switch ($scope.type) {
          case 'dockerfile':
            $scope.expectedFilename = 'Dockerfile';
            var dockerfile = $scope.getDockerFile($scope.containerObj.id, $scope.selTagName);
            if(dockerfile !== undefined){
              dockerfile.then(function(s){
                $scope.totalLinesDf = s.split(/\n/).length;
                $scope.getContentHTML("dockerfile");
              },
              function(e){
                console.log("error refreshDocument",e);
              });
            }
            break;
          case 'descriptor':
            $scope.expectedFilename = 'Descriptor';
            // prepare Descriptor Imports drop-down
            $scope.secondaryDescriptors = extracted();
            $scope.selSecondaryDescriptorName = $scope.secondaryDescriptors[0];
            var file = $scope.getSecondaryDescriptorFile($scope.containerObj.id, $scope.selTagName, $scope.selDescriptorName, $scope.selSecondaryDescriptorName);
            if(file !== undefined){
              file.then(function(s){
                $scope.totalLinesDesc = s.split(/\n/).length;
                $scope.getContentHTML("descriptor");
              },
              function(e){
                console.log("error refreshDocument",e);
              });
            }
            break;
          default:
          // ...
        }
      };

      $scope.refreshDocument = function() {
        $scope.fileLoaded = false;
        $scope.fileContents = null;
        switch ($scope.type) {
          case 'dockerfile':
            $scope.expectedFilename = 'Dockerfile';
            var dockerfile = $scope.getDockerFile($scope.containerObj.id, $scope.selTagName);
            if(dockerfile !== undefined){
              dockerfile.then(function(s){
                $scope.totalLinesDf = s.split(/\n/).length;
                $scope.getContentHTML("dockerfile");
              },
              function(e){
                console.log("error refreshDocument",e);
              });
            }
            break;
          case 'descriptor':
            $scope.expectedFilename = 'Descriptor';
            var file = $scope.getSecondaryDescriptorFile($scope.containerObj.id, $scope.selTagName, $scope.selDescriptorName, $scope.selSecondaryDescriptorName);
            if(file !== undefined){
              file.then(function(s){
                $scope.totalLinesDesc = s.split(/\n/).length;
                $scope.getContentHTML("descriptor");
              },
              function(e){
                console.log("error refreshDocument",e);
              });
            }
            break;
          default:
            // ...
        }
      };

      $scope.setDocument();

  }]);

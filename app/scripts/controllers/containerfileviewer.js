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
 * @ngdoc controller
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
    '$location',
    function ($scope, $q, ContainerService, NtfnService, $location) {

      var descriptors = ["cwl", "wdl"];

      $scope.fileLoaded = false;
      $scope.fileContents = null;
      $scope.successContent = [];
      $scope.fileContent = null;

      $scope.checkDockerfile = function() {
        var dockerfile = $scope.getDockerFile($scope.containerObj.id, $scope.selTagName);
      };

      $scope.setBioschema = function() {
        // default bioschema
        var bioschema = [{
            "@context": "http://schema.org",
            "@type": "SoftwareApplication",
            "name": $scope.containerObj.name,
            "description": $scope.containerObj.description,
            "url": $location.absUrl(),
            "applicationCategory": "Command Line Tool",
            "operatingSystem": "Linux",
            "image": "https://avatars0.githubusercontent.com/u/9947495?v=3&s=200"
        }];

        ContainerService.getSchema($scope.containerObj.id).then(
          function(schema) {
            // always use the user defined schemas
            if (schema.length > 0) {
              bioschema = schema;
            }
          },
          function(response) {
            return $q.reject(response);
          }
        ).finally(
          function() {
            $scope.$emit('bioschemaSet', bioschema);
          }
        );
      };

      // TODO: This function is way too long, it should be shortened
      // Check that the descriptor is valid
      $scope.checkDescriptor = function() {
        $scope.containerTags = $scope.getContainerTags();
        if ($scope.containerTags.length === 0) {
          return;
        }
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

            if (result !== null) {
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
            }

            $scope.$emit('returnMissing',m);
            $scope.$emit('returnValid',v);
            $scope.refreshDocument();
          },
          function(e){
            console.log("error",e);
          });
      };

      // Filter descriptor select element  (CWL/WDL)
      $scope.filterDescriptor = function(element) {
      if ($scope.isDescriptor()){
        for(var i=0;i<$scope.successContent.length;i++){
          if($scope.successContent[i].descriptor === element && $scope.successContent[i].tag === $scope.selTagName){
            return true;
          } else{
            if(i===$scope.successContent.length -1){
              return false;
            }
          }
        }
      } else if ($scope.isTestJson()) {
           for(var j=0;j<$scope.containerObj.tags.length;j++){
             if($scope.containerObj.tags[j].name === $scope.selTagName){
               for(var k=0; k < $scope.containerObj.tags[j].sourceFiles.length; k++) {
                 if (($scope.containerObj.tags[j].sourceFiles[k].type === 'CWL_TEST_JSON' && element === 'cwl') || ($scope.containerObj.tags[j].sourceFiles[k].type === 'WDL_TEST_JSON' && element === 'wdl')) {
                   return true;
                 }
               }
               return false;
             }
           }
         } else {
           return true;
         }
      };

      // Filter version select element (Tags)
      $scope.filterVersion = function (element) {
        if ($scope.isDockerfile() || $scope.isDescriptor()) {
          for (var i = 0; i < $scope.successContent.length; i++) {
            if ($scope.successContent[i].tag === element) {
              return true;
            } else {
              if (i === $scope.successContent.length - 1) {
                return false;
              }
            }
          }
        } else if ($scope.isTestJson()) {
          for (var j = 0; j < $scope.containerObj.tags.length; j++) {
            var tag = $scope.containerObj.tags[j];
            if (tag.name === element) {
              for (var k = 0; k < tag.sourceFiles.length; k++) {
                var sourceFile = tag.sourceFiles[k];
                if (sourceFile.type === 'CWL_TEST_JSON' || sourceFile.type === 'WDL_TEST_JSON') {
                  // show if any source file is a test json
                  return true;
                }
              }
              // if no source files are test json
              return false;
            }
          }
        }
        else {
          // this should not occur, this is a different kind of scope
          return false;
        }
      };

      // Check if in the dockerfile tab
      $scope.isDockerfile = function() {
        return $scope.type === 'dockerfile';
      };

      // Check if in the test parameter tab
      $scope.isTestJson = function() {
        return $scope.type === 'testparameter';
      };

      // Check if in the descriptor tab
      $scope.isDescriptor = function() {
        return $scope.type === 'descriptor';
      };

      // Update the type
      $scope.setType = function(type) {
        $scope.type = type;
      };

      // Get a list of tags for the current container (names only)
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

      // Grab the dockerfile for the given tag and update the file contents
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

      // Grab the test parameter file for the given tag and descriptor type and update the file contents
      $scope.getTestJson = function(containerId, tagName, descType, filePath, fileType) {
        return ContainerService.getTestJson(containerId, tagName, descType)
          .then(
            function(testJson) {
              for (var i = 0; i < testJson.length; i++) {
                if (testJson[i].path === filePath && testJson[i].type === fileType) {
                  $scope.fileContents = testJson[i].content;
                  return testJson[i].content;
                }
              }
              return undefined;
            },
            function(response) {
              return $q.reject(response);
            }
          )
          .finally(
            function() { $scope.fileLoaded = true; }
          );
      };

      // Grab the descriptor file for the given tag and descriptor type and update the file contents
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

      // Grab a secondary descriptor file for the given tag, descriptor type, and path and update the file contents
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
      function extracted(fileType){
        if($scope.containerObj.tags.length !==0){
          return $scope.containerObj.tags.filter(
            function(a) {
              return a.name === $scope.selTagName;})[0].sourceFiles.filter(
              function(a) {
                return a.type === '' + fileType;}).map(
                function(a) {
                  return a.path;
                }).sort();
        }else{
          return [];
        }

      }

      // Initialize the select/dropdown elements
      $scope.setDocument = function() {
        $scope.setBioschema();

        // prepare Container Version drop-down
        $scope.containerTags = $scope.getContainerTags();
        $scope.selTagName = $scope.containerTags[0];
        // prepare Descriptor Type drop-down
        $scope.descriptors = descriptors;
        $scope.selDescriptorName = descriptors[0];
        // prepare Descriptor Imports drop-down
        var fileType = $scope.selDescriptorName === 'cwl' ? 'DOCKSTORE_CWL' : 'DOCKSTORE_WDL';

        $scope.fileList = extracted(fileType);
        $scope.selFileName = $scope.fileList[0];
      };

      // Update the file contents based on the type and selected values of the dropdowns
      $scope.refreshDocument = function(versionChange, descriptorTypeChange, fileNameChange) {
        $scope.fileLoaded = false;
        $scope.fileContents = null;

        var testFileType = $scope.selDescriptorName === 'cwl' ? 'CWL_TEST_JSON' : 'WDL_TEST_JSON';
        var fileType = $scope.selDescriptorName === 'cwl' ? 'DOCKSTORE_CWL' : 'DOCKSTORE_WDL';

        switch ($scope.type) {
          case 'dockerfile':
            $scope.expectedFilename = 'Dockerfile';
            var dockerfile = $scope.getDockerFile($scope.containerObj.id, $scope.selTagName);
            break;
          case 'descriptor':
            $scope.expectedFilename = 'Descriptor';
            // prepare Descriptor Imports drop-down
            $scope.fileList = extracted(fileType);
            $scope.selectDropdownOptions(versionChange, descriptorTypeChange, fileNameChange);

            var file = $scope.getSecondaryDescriptorFile($scope.containerObj.id, $scope.selTagName, $scope.selDescriptorName, $scope.selFileName);
            break;
          case 'testparameter':
            $scope.expectedFilename = 'Test Parameter File';
            $scope.fileList = extracted(testFileType);
            $scope.selectDropdownOptions(versionChange, descriptorTypeChange, fileNameChange);

            var testjson = $scope.getTestJson($scope.containerObj.id, $scope.selTagName, $scope.selDescriptorName,$scope.selFileName, testFileType);
            break;
          default:
          // ...
        }
      };

      $scope.onSuccess = function(e) {
        e.clearSelection();
        NtfnService.popSuccess('Copy Success');
      };

      $scope.onError = function(e) {
        NtfnService.popFailure('Copy Failure');
      };

      $scope.selectDropdownOptions = function(versionChange, descriptorTypeChange, fileNameChange) {
        if (versionChange && $scope.filteredVersions.length > 0) {
          // Retain the previous selected version if possible
          if (!$.inArray($scope.selTagName, $scope.filteredVersions)) {
            $scope.selTagName = $scope.filteredVersions[0];
          }
        }
        if (descriptorTypeChange && $scope.filteredDescriptorType.length > 0) {
          // Retain the previous selected descriptor name if possible
          if (!$.inArray($scope.selDescriptorName, $scope.filteredDescriptorType)) {
            $scope.selDescriptorName = $scope.filteredDescriptorType[0];
          }
        }
        if (fileNameChange && $scope.fileList.length > 0) {
            $scope.selFileName = $scope.fileList[0];
        }
      };

      $scope.setDocument();

  }]);

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
      $scope.fileContent = null;

      $scope.getContentHTML = function() {
        var pre = document.getElementsByTagName('pre');
        var contentHTML = pre[0].innerHTML;
        var firstChildNode = pre[0].firstChild;
        var codeTag = document.getElementById('code');

        if(contentHTML !== "<code class=\"hljs\"></code>" && contentHTML !== "<code class=\"hljs yaml\"></code>"){
          if($('#preCopy').length === 0){
            $('pre').hide(); //hide the original code
            //create new elements/nodes for copy of pre
            var preCopy = document.createElement("PRE");
            var lineNumSpan = document.createElement("SPAN");
            var closeSpan = document.createElement("SPAN");

            //set id and classes
            preCopy.setAttribute("id","preCopy");
            lineNumSpan.setAttribute("class","line-number");
            closeSpan.setAttribute("class","cl");

            //append nodes to appropriate tags
            preCopy.appendChild(lineNumSpan);
            preCopy.appendChild(firstChildNode);
            preCopy.appendChild(closeSpan);
            codeTag.appendChild(preCopy);
          }

          //get line numbers node and total line numbers
          var lineNumNode = document.getElementsByClassName('line-number');
          var lineNumLength = $('.line-number').children().length;
          //reset line numbers for new file by removing the nodes of line numbers
          if(lineNumLength > 0){
            while(lineNumNode[0].firstChild){
              lineNumNode[0].removeChild(lineNumNode[0].firstChild);
            }
          }
          //add the line numbers beside the descriptor file
          for (var i = 1; i < $scope.totalLines; i++) {
            var line = document.createElement("SPAN");
            line.innerHTML = i;
            $('.line-number').append(line);
          }

        }

      };

      $scope.checkDescriptor = function() {
        $scope.workflowVersions = $scope.getWorkflowVersions();
        if ($scope.workflowVersions.length === 0){
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
            $scope.selVersionName = $scope.successContent[0].version;
            $scope.fileContent = $scope.successContent[0].content;
            var result = $scope.fileContent;
            m = [];
            v = false;
            count = 0;

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
            $scope.getContentHTML();
            $scope.$emit('returnMissing',m);
            $scope.$emit('returnValid',v);
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

      $scope.getDescriptorFilePath = function(containerId, tagName, type) {
        return WorkflowService.getDescriptorFilePath(containerId, tagName, type)
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

      $scope.refreshDocumentType = function() {
        $scope.fileLoaded = false;
        $scope.fileContents = null;
        $scope.expectedFilename = 'Descriptor';
        $scope.secondaryDescriptors = extracted();
        $scope.selSecondaryDescriptorName = $scope.secondaryDescriptors[0];
        var file = $scope.getSecondaryDescriptorFile($scope.workflowObj.id, $scope.selVersionName, $scope.descriptor, $scope.selSecondaryDescriptorName);
        if (file) {
          file.then(
           function(s){
             $scope.totalLines = s.split(/\n/).length;
              $scope.getContentHTML();
           },
            function(e){
             console.log("error refreshDocumentType",e);
           });
          }
      };

      $scope.refreshDocument = function() {
        $scope.fileLoaded = false;
        $scope.fileContents = null;
        $scope.expectedFilename = 'Descriptor';
        var file = $scope.getSecondaryDescriptorFile($scope.workflowObj.id, $scope.selVersionName, $scope.descriptor, $scope.selSecondaryDescriptorName);
        if (file) {
          file.then(
            function(s){
              $scope.totalLines = s.split(/\n/).length;
              $scope.getContentHTML();
            },
            function(e){
              console.log("error refreshDocument",e);
            });
          }
      };

      $scope.setDocument();

  }]);

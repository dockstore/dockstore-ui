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
 * @name dockstore.ui.controller:ContainerDetailsCtrl
 * @description
 * # ContainerDetailsCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('ContainerDetailsCtrl', [
    '$scope',
    '$q',
    '$sce',
    'ContainerService',
    'FormattingService',
    'UtilityService',
    'NotificationService',
    function ($scope, $q, $sce, ContainerService, FrmttSrvc, UtilityService, NtfnService) {
      $scope.labelsEditMode = false;
      $scope.dockerfileEnabled = false;
      $scope.descriptorEnabled = false;
      $scope.validContent = true;
      $scope.missingContent = [];
      $scope.missingWarning = false;
      $scope.invalidClass = false;
      $scope.showEditCWL = true;
      $scope.showEditWDL = true;
      $scope.showEditDockerfile = true;
      $scope.showEditCWLTestParameterPath = true;
      $scope.showEditWDLTestParameterPath = true;
      $scope.launchWith = null;
      $scope.launchWithCWLTool = null;
      $scope.desc = 'cwl';
      $scope.toolTag = '';
      $scope.toolTagName = '';
      $scope.validTags = [];
      $scope.descAvailable = [];
      $scope.buildTooltip = $sce.trustAsHtml('<strong>Fully-Automated</strong>: All versions are automated builds<br><strong>Partially-Automated</strong>: At least one version is an automated build<br><strong>Manual</strong>: No versions are automated builds<br><strong>Unknown</strong>: Build information not known');
      $scope.toolMaintainerTooltip = $sce.trustAsHtml('E-mail of tool maintainer to be contacted for requesting private image access<br>Defaults to tool author if no tool maintainer given');
      $scope.dockerPullTag = '';

      //There are 5 tabs, and only 1 can be active
      // so there are 4 other tabs that are not active
      var notActiveTabs = 4;

      if (!$scope.activeTabs) {
        $scope.activeTabs = [true];
        for (var i = 0; i < notActiveTabs; i++) $scope.activeTabs.push(false);
      }

      $scope.checkPage = function(){
        $scope.$broadcast('checkDescPageType');
      };

      $scope.refreshTagLaunchWith = function() {
        //get the tool tags that are valid
        if ($scope.containerObj === null){
          return;
        }
        $scope.validTags = [];
        for(var i=0;i<$scope.containerObj.tags.length;i++){
          if($scope.isTagValid($scope.containerObj.tags[i])){
            $scope.validTags.push($scope.containerObj.tags[i]);
          }
        }
        var isVersionValid = false;
        var firstTag;
        if($scope.validTags.length !==0){
          if ($scope.containerObj.defaultVersion === null) {
            $scope.toolTag = $scope.validTags[0].id;
            $scope.toolTagName = $scope.validTags[0].name;
            firstTag = 0;
          } else {
            for (i = 0; i < $scope.validTags.length; i++) {
              if ($scope.validTags[i].name === $scope.containerObj.defaultVersion) {
                 $scope.toolTag = $scope.validTags[i].id;
                 $scope.toolTagName = $scope.validTags[i].name;
                 firstTag = i;
                 isVersionValid = true;
                break;
              }
            }
            if (!isVersionValid) {
              $scope.toolTag = $scope.validTags[0].id;
              $scope.toolTagName = $scope.validTags[0].name;
              firstTag = 0;
            }
          }
        }
        $scope.refreshDescLaunchWith(firstTag);
      };

      $scope.refreshDescLaunchWith = function(tagIndex) {
        //get the descriptor type that is available for tool version
        if ($scope.validTags.length === 0) {
          return;
        }
        $scope.descAvailable = [];
        for(var j=0;j<$scope.validTags[tagIndex].sourceFiles.length;j++){
          var fileType = $scope.validTags[tagIndex].sourceFiles[j].type;
          if($scope.descAvailable.indexOf(fileType)){
            if(fileType === 'DOCKSTORE_CWL' && $scope.descAvailable.indexOf('cwl') === -1){
              $scope.descAvailable.push('cwl');
            } else if(fileType === 'DOCKSTORE_WDL' && $scope.descAvailable.indexOf('wdl') === -1){
              $scope.descAvailable.push('wdl');
            }
          }
        }
        if($scope.descAvailable.length !==0){
          $scope.desc = $scope.descAvailable[tagIndex];
        }
      };

      $scope.getDescriptorByTag = function(tagObject){
        //get descriptor by tag chosen
        $scope.descAvailable = [];
        for(var j=0;j<tagObject.sourceFiles.length;j++){
          var fileType = tagObject.sourceFiles[j].type;
          if($scope.descAvailable.indexOf(fileType)){
            if(fileType === 'DOCKSTORE_CWL' && $scope.descAvailable.indexOf('cwl') === -1){
              $scope.descAvailable.push('cwl');
            } else if(fileType === 'DOCKSTORE_WDL' && $scope.descAvailable.indexOf('wdl') === -1){
              $scope.descAvailable.push('wdl');
            }
          }
        }
        if($scope.descAvailable.length !==0){
          $scope.desc = $scope.descAvailable[0];
        }
      };

      $scope.showLaunchWith = function() {
        if($scope.containerObj === undefined ||  $scope.containerObj === null || $scope.containerObj.tags.length === 0 ||
          $scope.validTags.length === 0){
          //no tags available in the container, do not show launchWith
          //return false immediately to get out of this method
          return false;
        }

        // assign default values
        var tool_path = $scope.containerObj === null ? "" : $scope.containerObj.path;

        //get the tag name from tag id
        for(var i=0;i<$scope.validTags.length;i++){
          if($scope.toolTag === $scope.validTags[i].id){
            $scope.toolTagName = $scope.validTags[i].name;
            break;
          }
        }

        //get rid of blank option in tag dropdown if exists
        if(document.getElementById('tagVersion')[0] !== undefined &&
          (document.getElementById('tagVersion')[0].value === '?' ||
          document.getElementById('tagVersion')[0].value === '')){
          $scope.refreshTagLaunchWith();
          var firstElement = $scope.toolTagName;
          var validTagsNameArray =[];
          for(var j=0;j<$scope.validTags.length;j++){
            validTagsNameArray.push($scope.validTags[j].name);
          }
          var tagVersion = $("#tagVersion");
          tagVersion.find("option").filter(function(){
            return $(this).text() === firstElement;
          }).attr('selected',true);
          tagVersion.find("option").filter(function(){
            return window.jQuery.inArray($(this).text(),validTagsNameArray) === -1;
          }).remove();
        }

        //get rid of blank option in descriptor dropdown if exists
        if(document.getElementById('descType')[0] !== undefined &&
          (document.getElementById('descType')[0].value === '?' ||
          document.getElementById('descType')[0].value === '')){
          var firstElementDesc = $scope.descAvailable[0];
          var descriptorAvailable = $scope.descAvailable;
          var descType = $("#descType");
          descType.find("option").filter(function(){
            return $(this).text() === firstElementDesc;
          }).attr('selected',true);
          descType.find("option").filter(function(){
            return window.jQuery.inArray($(this).text(),descriptorAvailable) === -1;
          }).remove();
        }

        $scope.launchWith =
          "# make a runtime JSON template and fill in desired inputs, outputs, and other parameters" +
          "\ndockstore tool convert entry2json --entry " + tool_path + ":" + $scope.toolTagName +" > Dockstore.json" +
          "\nvim Dockstore.json"+
          "\n# run it locally with the Dockstore CLI" +
          "\ndockstore tool launch --entry " + tool_path + ":" + $scope.toolTagName + " --json Dockstore.json";

        if ($scope.desc !== 'cwl') {
          $scope.launchWith += " --descriptor " + $scope.desc;
        }

        var escapedPath = encodeURIComponent(tool_path);
        var escapedVersion = encodeURIComponent($scope.toolTagName);

        $scope.launchWithCWLTool = "# alternatively, cwltool can run a tool directly when all inputs and outputs are available on the local filesystem" +
          "\ncwltool --non-strict https://www.dockstore.org:8443/api/ga4gh/v1/tools/" + escapedPath + "/versions/" + escapedVersion + "/plain-CWL/descriptor Dockstore.json";
        return $scope.validContent; //only show LaunchWith when content is valid
      };

      $scope.tagLaunchWith = function(tag) {
        //method is called when specific tag is selected
        //to change the LaunchWith commands
        $scope.toolTag = tag;
        for(var i=0;i<$scope.containerObj.tags.length;i++){
          if(tag === $scope.containerObj.tags[i].id){
            $scope.getDescriptorByTag($scope.containerObj.tags[i]);
            break;
          }
        }
        $scope.showLaunchWith();
      };

      $scope.descLaunchWith = function(descriptor) {
        //method is called when descriptor is selected
        //to change the LaunchWith commands
        $scope.desc = descriptor;
        $scope.showLaunchWith();
      };

      $scope.isTagValid = function(element) {
        return !!element.valid;
      };

      $scope.loadContainerDetails = function(containerPath) {
        $scope.setContainerDetailsError(null);
        return ContainerService.getPublishedContainerByToolPath(containerPath)
          .then(
            function(containerObj) {
              $scope.containerObj = containerObj;
            },
            function(response) {
              $scope.setContainerDetailsError(
                'The webservice encountered an error trying to retrieve this ' +
                'container, please ensure that the container exists and is ' +
                'published for public access.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.setContainerRegistration = function(containerId, isPublished) {
        $scope.setContainerDetailsError(null);
        return ContainerService.setContainerRegistration(containerId, isPublished)
          .then(
            function(containerObj) {
              $scope.containerObj.is_published = containerObj.is_published;
              $scope.updateContainerObj();
              return containerObj;
            },
            function(response) {
              $scope.setContainerDetailsError(
                'The webservice encountered an error trying to register this ' +
                'container, please ensure that the associated Dockerfile and ' +
                'Dockstore.cwl descriptor are valid and accessible.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          ).finally(function() {
            $scope.containerEditData.isPublished = $scope.containerObj.is_published;
          });
      };

      $scope.deregisterContainer = function(containerId) {
        $scope.setContainerDetailsError(null);
        return ContainerService.deleteContainer(containerId)
          .then(
            function() {
              $scope.$emit('deregisterContainer', containerId);
              return containerId;
            },
            function(response) {
              $scope.setContainerDetailsError(
                'The webservice encountered an error trying to delete this ' +
                'container, please ensure that the container exists, and is ' +
                'set to manual build mode.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.refreshContainer = function(containerId, activeTabIndex) {
        $scope.setContainerDetailsError(null);
        if ($scope.refreshingContainer) return;
        $scope.refreshingContainer = true;
        return ContainerService.refreshContainer(containerId)
          .then(
            function(containerObj) {
              $scope.updateContainerObj({
                containerObj: containerObj,
                activeTabIndex: activeTabIndex ? activeTabIndex : null
              });
              $scope.updateInfoURLs();
              $scope.$broadcast('refreshFiles');
              return containerObj;
            },
            function(response) {
              $scope.setContainerDetailsError(
                'The webservice encountered an error trying to refresh this ' +
                'container, please ensure that the associated Dockerfile and ' +
                'Dockstore.cwl descriptor are valid and accessible.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          ).finally(function() {
            $scope.refreshingContainer = false;
          });
      };

      $scope.getMailToLink = function(containerObj){
        return UtilityService.getMailToLink("tool", containerObj.path, window.location, containerObj.email);
      };

      $scope.checkContentValid = function(){
        //will print this when the 'Publish' button is clicked
        var message = 'The file is missing some required fields. Please make sure the file has all the required fields. ';
        var missingMessage = 'The missing field(s):';
        if($scope.validContent){
          if($scope.missingContent.length !== 0){
            $scope.missingWarning = true;
          }
          return true;

        } else{
            if($scope.missingContent.length !== 0){
              $scope.missingWarning = false;
              for(var i=0;i<$scope.missingContent.length;i++){
                missingMessage += ' \''+$scope.missingContent[i]+'\'';
                if(i !== $scope.missingContent.length -1){
                  missingMessage+=',';
                }
              }
              if(!$scope.refreshingWorkflow){
                if($scope.containerObj.descriptorType === 'wdl'){
                  $scope.setContainerDetailsError(
                    message+missingMessage +
                    '. Required fields in WDL file: \'task\', \'workflow\', \'call\', \'command\', and \'output\'',''
                  );
                }else{
                  $scope.setContainerDetailsError(
                    message+missingMessage +
                    '. Required fields in CWL Tool file: \'inputs\', \'outputs\', \'class: CommandLineTool\', and \'baseCommand\'',''
                  );
                }
              }
            }

            if($scope.invalidClass){
              //file is invalid because class is workflow instead of commandlinetool
              $scope.setContainerDetailsError(
                'This CWL file is not a CommandLineTool'+
                '. Required fields in CWL Tool file: \'inputs\', \'outputs\', \'class: CommandLineTool\', and \'baseCommand\'',''
              );
            }

          return false;
        }
      };

      /* Editing entire containers is not possible yet... */
      $scope.setContainerLabels = function(containerId, labels) {
        $scope.setContainerDetailsError(null);
        return ContainerService.setContainerLabels(containerId, labels)
          .then(
            function(containerObj) {
              $scope.containerObj.labels = containerObj.labels;
              $scope.updateContainerObj();
              return containerObj;
            },
            function(response) {
              $scope.setContainerDetailsError(
                'The webservice encountered an error trying to modify labels ' +
                'for this container, please ensure that the label list is ' +
                'properly-formatted and does not contain prohibited ' +
                'characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.resetContainerEditData = function(containerObj) {
        var labels = (function(labelObjArray) {
          var labelArray = $scope.getContainerLabelStrings(labelObjArray);
          var labels = '';
          for (var i = 0; i < labelArray.length; i++) {
            labels += labelArray[i] + ((i !== labelArray.length - 1) ? ', ' : '');
          }
          return labels;
        })(containerObj.labels);

        $scope.containerEditData = {
          labels: labels,
          is_published: containerObj.is_published
        };
      };

      $scope.setContainerDetailsError = function(message, errorDetails) {
        if (message) {
          $scope.containerDetailsError = {
            message: message,
            errorDetails: errorDetails
          };
        } else {
          $scope.containerDetailsError = null;
        }
      };

      $scope.getContainerModeString = function(mode) {
        switch (mode) {
          case 'AUTO_DETECT_QUAY_TAGS_AUTOMATED_BUILDS':
            return 'Fully-Automated';
          case 'AUTO_DETECT_QUAY_TAGS_WITH_MIXED':
            return 'Partially-Automated';
          case 'MANUAL_IMAGE_PATH':
            return 'Manual';
          default:
            return 'Unknown';
        }
      };

      $scope.getTimeAgoString = function(timestamp) {
        return UtilityService.getTimeAgoString(timestamp);
      };

      $scope.getGitReposProvider = FrmttSrvc.getGitReposProvider;
      $scope.getGitReposProviderName = FrmttSrvc.getGitReposProviderName;
      $scope.getGitReposWebUrl = FrmttSrvc.getGitReposWebUrl;
      $scope.getImageReposProvider = FrmttSrvc.getImageReposProvider;
      $scope.getImageReposProviderName = FrmttSrvc.getImageReposProviderName;
      $scope.getImageReposWebUrl = FrmttSrvc.getImageReposWebUrl;

      $scope.updateInfoURLs = function() {
        /* Git Repository */
        $scope.gitReposProvider = $scope.getGitReposProvider(
            $scope.containerObj.gitUrl);
        $scope.gitReposProviderName = $scope.getGitReposProviderName(
            $scope.gitReposProvider);
        $scope.gitReposWebUrl = $scope.getGitReposWebUrl(
            $scope.containerObj.gitUrl,
            $scope.gitReposProvider);
        /* Image Repository */
        $scope.imageReposProvider = $scope.getImageReposProvider(
            $scope.containerObj.path);
        $scope.imageReposProviderName = $scope.getImageReposProviderName(
            $scope.imageReposProvider);
        $scope.imageReposWebUrl = $scope.getImageReposWebUrl(
            $scope.containerObj.path,
            $scope.imageReposProvider);
      };

      $scope.getDateTimeString = FrmttSrvc.getDateTimeString;

      $scope.getContainerLabelStrings = function(labels) {
        var sortedLabels = labels.sort(function(a, b) {
          if (a.value < b.value) return -1;
          if (a.value > b.value) return 1;
          return 0;
        });
        var labelStrings = [];
        for (var i = 0; i < sortedLabels.length; i++) {
            labelStrings.push(sortedLabels[i].value);
        }
        return labelStrings;
      };

      $scope.checkOverflow = function() {
        return $('#label-values')[0].scrollHeight > $('#label-holder').height();
      };

      $scope.moveToStart = function(element) {
        $('#label-button-holder').insertBefore($('#' + element));

      };

      $scope.selectLabelTab = function() {
       for (var i = 0; i < notActiveTabs; i++) $scope.activeTabs[i] = false;
       $scope.activeTabs[1] = true;
      };

      $scope.toggleLabelsEditMode = function() {
        $scope.labelsEditMode = !$scope.labelsEditMode;
      };

      $scope.getDockerPullCmd = function(path) {
        return FrmttSrvc.getFilteredDockerPullCmd(path);
      };

      $scope.getDockerPullCmdForTag = function() {
        if ($scope.containerObj !== null) {
          return FrmttSrvc.getFilteredDockerPullCmd($scope.containerObj.path);
        }
      };

      $scope.submitDescriptorEdits = function(type){
        var cwlpath = $scope.containerObj.default_cwl_path;
        var wdlpath = $scope.containerObj.default_wdl_path;
        var dfpath = $scope.containerObj.default_dockerfile_path;

        if(type === 'cwl' && cwlpath === ''){
          if(wdlpath === ''){
            $scope.containerObj.default_cwl_path = '/Dockstore.cwl';
          }
        } else if(type === 'wdl' && wdlpath === ''){
          if(cwlpath === ''){
            $scope.containerObj.default_wdl_path = '/Dockstore.wdl';
          }
        } else if(type === 'dockerfile' && dfpath === ''){
            $scope.containerObj.default_dockerfile_path = '/Dockerfile';
        }

        if($scope.containerObj.default_cwl_path !== 'undefined' || $scope.containerObj.default_wdl_path !== 'undefined' ||
            $scope.containerObj.default_dockerfile_path !== 'undefined'){
          $scope.updateToolAndTags();
        }
      };

      $scope.submitTestParameterFileEdits = function(){
        if(($scope.containerObj.default_cwl_test_parameter_file !== 'undefined') || ($scope.containerObj.default_wdl_test_parameter_file !== 'undefined')) {
          $scope.updateToolAndTags();
        }
      };

      $scope.updateToolAndTags = function() {
        $scope.updateToolDefaultPaths($scope.containerObj.id)
          .then(function() {
            $scope.updateToolTagPaths($scope.containerObj.id)
              .then(function(){
                $scope.labelsEditMode = false;
                $scope.refreshContainer($scope.containerObj.id,0);
              });
          });
      };

      $scope.updateToolDefaultPaths = function(containerId){
        return ContainerService.updateToolDefaults(containerId, $scope.containerObj)
          .then(
            function(containerObj){
              $scope.updateToolInfoWithDatabaseInfo(containerObj);
              $scope.updateContainerObj();
              return containerObj;
            },
            function(response) {
              $scope.setContainerDetailsError(
                'The webservice encountered an error trying to modify default path ' +
                'for this container, please ensure that the path is valid, ' +
                'properly-formatted and does not contain prohibited ' +
                'characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.updateToolTagPaths = function(containerId) {
        return ContainerService.updateToolPathTag(containerId, $scope.containerObj)
          .then(
            function(containerObj){
              $scope.updateToolInfoWithDatabaseInfo(containerObj);
              $scope.updateContainerObj();
              return containerObj;
            },
            function(response) {
              $scope.setContainerDetailsError(
                'The webservice encountered an error trying to modify default path ' +
                'for this container, please ensure that the path is valid, ' +
                'properly-formatted and does not contain prohibited ' +
                'characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.updateToolInfoWithDatabaseInfo = function(containerObj) {
        if($scope.containerObj.default_cwl_path !== containerObj.default_cwl_path){
          $scope.containerObj.default_cwl_path = containerObj.default_cwl_path;
        } else if($scope.containerObj.default_wdl_path !== containerObj.default_wdl_path){
          $scope.containerObj.default_wdl_path = containerObj.default_wdl_path;
        } else if($scope.containerObj.default_dockerfile_path !== containerObj.default_dockerfile_path){
          $scope.containerObj.default_dockerfile_path = containerObj.default_dockerfile_path;
        } else if($scope.containerObj.default_cwl_test_parameter_file !== containerObj.default_cwl_test_parameter_file){
          $scope.containerObj.default_cwl_test_parameter_file = containerObj.default_cwl_test_parameter_file;
        } else if($scope.containerObj.default_wdl_test_parameter_file !== containerObj.default_wdl_test_parameter_file){
          $scope.containerObj.default_wdl_test_parameter_file = containerObj.default_wdl_test_parameter_file;
        }
      };

      $scope.submitContainerEdits = function() {
        if (!$scope.labelsEditMode) {
          $scope.labelsEditMode = true;
          return;
        }
        // the edit object should be recreated
        if ($scope.containerEditData.labels !== 'undefined') {
          $scope.setContainerLabels($scope.containerObj.id,
              $scope.containerEditData.labels)
            .then(function() {
              $scope.labelsEditMode = false;
            });
        }
      };

      $scope.isContainerValid = function() {
        if ($scope.containerObj.is_published) {
          return true;
        }

        var versionTags = $scope.containerObj.tags;

        if (versionTags === null) {
          return false;
        }

        for (var i = 0; i < versionTags.length; i++) {
          if (versionTags[i].valid) {
            return true;
          }
        }
        return false;
      };

      $scope.$watch('containerPath', function(newValue) {
        if (newValue) {
          $scope.setContainerDetailsError(null);
          $scope.missingContent = [];
          $scope.missingWarning = false;

          if (!$scope.editMode) {
            $scope.loadContainerDetails($scope.containerPath)
              .then(function() {
                $scope.updateInfoURLs();
                $scope.refreshTagLaunchWith();
              });
          } else {
            $scope.labelsEditMode = false;
            $scope.resetContainerEditData($scope.containerObj);
            $scope.updateInfoURLs();
            $scope.refreshTagLaunchWith();
          }
        }
      });

      $scope.$watch('containerToolname', function(newValue) {
        if (newValue) {
          $scope.updateInfoURLs();
        }
      });

      $scope.$watch('toolTagName', function(newValue) {
        if (newValue) {
          $scope.dockerPullTag = $scope.getDockerPullCmdForTag();
        }
      });

      $scope.onSuccess = function(e) {
        e.clearSelection();
        NtfnService.popSuccess('Copy Success');
      };

      $scope.onError = function(e) {
        NtfnService.popFailure('Copy Failure');
      };

      $scope.isVerified = function() {
        return UtilityService.isVerifiedTool($scope.containerObj);
      };

      $scope.getVerifiedSources = function() {
        return UtilityService.getVerifiedToolSources($scope.containerObj);
      };

      $scope.isToolMaintainerEmailNullOrEmpty = function() {
        return ($scope.containerObj.tool_maintainer_email === null || $scope.containerObj.tool_maintainer_email === '');
      };

      $scope.getDockerRegistryName = function() {
        if ($scope.containerObj.registry === "DOCKER_HUB") {
          return "DockerHub";
        } else if ($scope.containerObj.registry === "QUAY_IO") {
          return "Quay.io";
        }
      };

      $scope.getRequestAccessEmail = function() {
        if(!$scope.isToolMaintainerEmailNullOrEmpty()) {
          return $scope.stripMailTo($scope.containerObj.tool_maintainer_email);
        } else {
          return $scope.stripMailTo($scope.containerObj.email);
        }
      };

      $scope.stripMailTo = function(email) {
        return email.replace(/^mailto:/, '');
      };
  }]);

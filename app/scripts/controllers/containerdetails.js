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
    'ContainerService',
    'FormattingService',
    'NotificationService',
    function ($scope, $q, ContainerService, FrmttSrvc, NtfnService) {

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
      $scope.launchWith = null;
      $scope.desc = 'cwl';
      $scope.toolTag = '';
      $scope.toolTagName = '';
      $scope.validTags = [];
      $scope.descAvailable = [];
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
        $scope.validTags = [];
        for(var i=0;i<$scope.containerObj.tags.length;i++){
          if($scope.isTagValid($scope.containerObj.tags[i])){
            $scope.validTags.push($scope.containerObj.tags[i]);
          }
        }
        if($scope.validTags.length !==0){
          $scope.toolTag = $scope.validTags[0].id;
          $scope.toolTagName = $scope.validTags[0].name;
        }
      };

      $scope.refreshDescLaunchWith = function() {
        //get the descriptor type that is available for tool version
        $scope.descAvailable = [];
        for(var j=0;j<$scope.validTags[0].sourceFiles.length;j++){
          var fileType = $scope.validTags[0].sourceFiles[j].type;
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
        if($scope.containerObj.tags.length === 0
          || $scope.validTags.length === 0){
          //no tags available in the container, do not show launchWith
          //return false immediately to get out of this method
          return false; 
        }

        // assign default values
        var tool_path = $scope.containerObj.path;
        var toJson = 'cwl2json';

        if($scope.desc === 'wdl'){
          toJson = 'wdl2json';
        }

        //get the tag name from tag id
        for(var i=0;i<$scope.validTags.length;i++){
          if($scope.toolTag === $scope.validTags[i].id){
            $scope.toolTagName = $scope.validTags[i].name;
            break;
          }
        }

        //get rid of blank option in tag dropdown if exists
        if(document.getElementById('tagVersion')[0].value === '?' || 
          document.getElementById('tagVersion')[0].value === ''){
          $scope.refreshTagLaunchWith();
          var firstElement = $scope.toolTagName;
          var validTagsNameArray =[];
          for(var i=0;i<$scope.validTags.length;i++){
            validTagsNameArray.push($scope.validTags[i].name);
          }

          $("#tagVersion option").filter(function(){
            return $(this).text() === firstElement;
          }).attr('selected',true);
          $("#tagVersion option").filter(function(){
            return jQuery.inArray($(this).text(),validTagsNameArray) === -1;
          }).remove();
        }

        //get rid of blank option in descriptor dropdown if exists
        if(document.getElementById('descType')[0].value === '?' || 
          document.getElementById('descType')[0].value === ''){
          var firstElement = $scope.descAvailable[0];
          var descriptorAvailable = $scope.descAvailable;

          $("#descType option").filter(function(){
            return $(this).text() === firstElement;
          }).attr('selected',true);
          $("#descType option").filter(function(){
            return jQuery.inArray($(this).text(),descriptorAvailable) === -1;
          }).remove();
        }

        $scope.launchWith = 
          "dockstore tool " + $scope.desc + " --entry " + tool_path + ":" + $scope.toolTagName +" > Dockstore." + $scope.desc +
          "\ndockstore tool convert " + toJson + " --" + $scope.desc + " Dockstore." + $scope.desc + " > Dockstore.json" +
          "\nvim Dockstore.json"+
          "\ndockstore tool launch --entry " + tool_path + ":" + $scope.toolTagName + " --json Dockstore.json";

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
        if(element.valid){
          return true;
        }else{
          return false;
        }
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
          ).finally(function(response) {
            $scope.containerEditData.isPublished = $scope.containerObj.is_published;
          });
      };

      $scope.deregisterContainer = function(containerId) {
        $scope.setContainerDetailsError(null);
        return ContainerService.deleteContainer(containerId)
          .then(
            function(response) {
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
          ).finally(function(response) {
            $scope.refreshingContainer = false;
          });
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

      $scope.updateToolTagPaths = function(containerId, cwlpath, wdlpath, dfpath) {
        var toolname = $scope.containerToolname;
        var giturl = $scope.containerObj.gitUrl;

        return ContainerService.updateToolPathTag(containerId, cwlpath, wdlpath, dfpath,toolname, giturl)
          .then(
            function(containerObj){
              if($scope.containerObj.default_cwl_path !== containerObj.default_cwl_path){
                $scope.containerObj.default_cwl_path = containerObj.default_cwl_path;
              } else if($scope.containerObj.default_wdl_path !== containerObj.default_wdl_path){
                $scope.containerObj.default_wdl_path = containerObj.default_wdl_path;
              } else if($scope.containerObj.default_dockerfile_path !== containerObj.default_dockerfile_path){
                $scope.containerObj.default_dockerfile_path = containerObj.default_dockerfile_path;
              }
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

      $scope.setDefaultToolPath = function(containerId, cwlpath, wdlpath, dfpath){
        var toolname = $scope.containerToolname;
        var giturl = $scope.containerObj.gitUrl;

        return ContainerService.setDefaultToolPath(containerId, cwlpath, wdlpath, dfpath,toolname, giturl)
          .then(
            function(containerObj){

              if($scope.containerObj.default_cwl_path !== containerObj.default_cwl_path){
                $scope.containerObj.default_cwl_path = containerObj.default_cwl_path;
              } else if($scope.containerObj.default_wdl_path !== containerObj.default_wdl_path){
                $scope.containerObj.default_wdl_path = containerObj.default_wdl_path;
              } else if($scope.containerObj.default_dockerfile_path !== containerObj.default_dockerfile_path){
                $scope.containerObj.default_dockerfile_path = containerObj.default_dockerfile_path;
              }
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

      $scope.getDaysAgo = function(timestamp) {
        var timeDiff = (new Date()).getTime() - timestamp;
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      };

      $scope.getDaysAgoString = function(timestamp) {
        var daysAgo = $scope.getDaysAgo(timestamp);
        if(daysAgo < 0){
          daysAgo = 0;
        }
        return daysAgo.toString() +
                ((daysAgo === 1) ? ' day ago' : ' days ago');
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

        if ($('#label-values')[0].scrollHeight > $('#label-holder').height()) {
           return true;
        } else {
          return false;
        }
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

      $scope.submitDescriptorEdits = function(type){
        var cwlpath = $scope.containerObj.default_cwl_path;
        var wdlpath = $scope.containerObj.default_wdl_path;
        var dfpath = $scope.containerObj.default_dockerfile_path;


        if(type === 'cwl' && cwlpath === ''){
          if(wdlpath === ''){
            cwlpath = '/Dockstore.cwl';
          }
        } else if(type === 'wdl' && wdlpath === ''){
          if(cwlpath === ''){
            wdlpath = '/Dockstore.wdl';
          }
        } else if(type === 'dockerfile' && dfpath === ''){
            dfpath = '/Dockerfile';
        }

        if($scope.containerObj.default_cwl_path !== 'undefined' || $scope.containerObj.default_wdl_path !== 'undefined' ||
            $scope.containerObj.default_dockerfile_path !== 'undefined'){
          $scope.setDefaultToolPath($scope.containerObj.id,
            cwlpath, wdlpath, dfpath)
          .then(function(containerObj) {
            $scope.updateToolTagPaths($scope.containerObj.id, cwlpath, wdlpath, dfpath)
              .then(function(containerObj){
                $scope.labelsEditMode = false;
                $scope.refreshContainer($scope.containerObj.id,0);
              });
          });
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
            .then(function(containerObj) {
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

      $scope.$watch('containerPath', function(newValue, oldValue) {
        if (newValue) {
          $scope.setContainerDetailsError(null);
          $scope.missingContent = [];
          $scope.missingWarning = false;

          if (!$scope.editMode) {
            $scope.loadContainerDetails($scope.containerPath)
              .then(function(containerObj) {
                $scope.updateInfoURLs();
                $scope.refreshTagLaunchWith();
                $scope.refreshDescLaunchWith();
              });
          } else {
            $scope.labelsEditMode = false;
            $scope.resetContainerEditData($scope.containerObj);
            $scope.updateInfoURLs();
            $scope.refreshTagLaunchWith();
            $scope.refreshDescLaunchWith();
          }
        }
      });

      $scope.$watch('containerToolname', function(newValue, oldValue) {
        if (newValue) {
          $scope.updateInfoURLs();
        }
      });

  }]);

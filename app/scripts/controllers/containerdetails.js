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
    'NotificationService',
    function ($scope, $q, ContainerService, NtfnService) {

      $scope.infoEditMode = false;

      $scope.loadContainerDetails = function(containerPath) {
        return ContainerService.getRegisteredContainerByPath(containerPath)
          .then(
            function(containerObj) {
              $scope.containerObj = containerObj;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('Docker Container Details', message);
              return $q.reject(response);
            }
          );
      };

      $scope.setContainerRegistration = function(containerId, isRegistered) {
        return ContainerService.setContainerRegistration(containerId, isRegistered)
          .then(
            function(containerObj) {
              $scope.containerObj.is_registered = containerObj.is_registered;
              $scope.updateContainerObj();
              return containerObj;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('Container Registration', message);
              return $q.reject(response);
            }
          );
      };

      /* Editing entire containers is not possible yet... */
      $scope.setContainerLabels = function(containerId, labels) {
        return ContainerService.setContainerLabels(containerId, labels)
          .then(
            function(containerObj) {
              $scope.containerObj.labels = containerObj.labels;
              $scope.updateContainerObj();
              return containerObj;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('Docker Container Details', message);
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
          labels: labels
        };
      };

      $scope.getDaysAgo = function(timestamp) {
        var timeDiff = (new Date()).getTime() - timestamp;
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      };

      $scope.getDaysAgoString = function(timestamp) {
        var daysAgo = $scope.getDaysAgo(timestamp);
        return daysAgo.toString() +
                ((daysAgo === 1) ? ' day ago' : ' days ago');
      };

      $scope.getDockerFile = function(containerId) {
        return ContainerService.getDockerFile(containerId)
          .then(
            function(dockerFile) {
              $scope.dockerFileString = dockerFile;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('Docker Container Details', message);
              return $q.reject(response);
            }
          )
          .finally(
            function() { $scope.dockerFileLoaded = true; }
          );
      };

      $scope.getWFDescriptorFile = function(containerId) {
        return ContainerService.getWFDescriptorFile(containerId)
          .then(
            function(wfDescriptorFile) {
              $scope.wfDescriptorFileString = wfDescriptorFile;
            },
            function(response) {
              var message = '[' + response.status + '] ' + response.statusText;
              NtfnService.popError('Docker Container Details', message);
              return $q.reject(response);
            }
          ).finally(
            function() { $scope.wfDescriptorFileLoaded = true; }
          );
      };

      $scope.getGitHubURL = function(containerGitUrl) {
        if (containerGitUrl.length <= 0) return;
        var gitHubURLRegexp = /^git@github.com:(.*)\/(.*).git$/i;
        var matchRes = gitHubURLRegexp.exec(containerGitUrl);
        return 'https://github.com/' + matchRes[1] + '/' + matchRes[2];
      };

      $scope.getQuayIOURL = function(containerPath) {
        if (containerPath.length <= 0) return;
        var quayIOPathRegexp = /^quay\.io\/(.*)\/(.*)$/i;
        var matchRes = quayIOPathRegexp.exec(containerPath);
        return 'https://quay.io/repository/' + matchRes[1] + '/' + matchRes[2];
      };

      $scope.getVersionTags = function(containerObj) {
        var tags = containerObj ? containerObj.tags : null;
        if (!tags || tags.length === 0) return ['n/a'];
        var versionTags = [];
        var descTags = tags.sort(function(a, b) {
          return b.version.localeCompare(a.version);
        });
        for (var i = 0; i < descTags.length; i++) {
          versionTags.push(descTags[i].version);
        }
        return versionTags;
      };

      $scope.getDateTimeString = function(timestamp) {
        var moy = ['Jan.', 'Feb.', 'Mar.', 'Apr.',
                    'May', 'Jun.', 'Jul.', 'Aug.',
                    'Sept.', 'Oct.', 'Nov.', 'Dec.'];
        var dateObj = new Date(timestamp);
        return moy[dateObj.getMonth()] + ' ' +
                dateObj.getDate() + ', ' +
                dateObj.getFullYear() + ' at ' +
                dateObj.toLocaleTimeString();
      };

      $scope.getContainerLabelStrings = function(labels) {
        var sortedLabels = labels.sort(function(a, b) {
          return a.value.localeCompare(b.value); 
        });
        var labelStrings = [];
        for (var i = 0; i < sortedLabels.length; i++) {
          labelStrings.push(sortedLabels[i].value);
        }
        return labelStrings;
      };

      $scope.toggleInfoEditMode = function() {
        $scope.infoEditMode = !$scope.infoEditMode;
      };

      $scope.submitContainerEdits = function() {
        if (!$scope.infoEditMode) {
          $scope.infoEditMode = true;
          return;
        }
        // the edit object should be recreated
        if ($scope.containerEditData.labels !== 'undefined') {
          $scope.setContainerLabels($scope.containerObj.id,
              $scope.containerEditData.labels)
            .then(function(containerObj) {
              $scope.infoEditMode = false;
            });
        }
      };

      $scope.loadDockerFile = function() {
        if (!$scope.dockerFileLoaded) {
          $scope.getDockerFile($scope.containerObj.id);
        }
      };

      $scope.loadWFDescriptorFile = function() {
        if (!$scope.wfDescriptorFileLoaded) {
          $scope.getWFDescriptorFile($scope.containerObj.id);
        }
      };

      $scope.$watch('containerPath', function(newValue, oldValue) {
        if (newValue) {
          if (!$scope.editMode) {
            $scope.loadContainerDetails($scope.containerPath)
              .then(function(containerObj) {
                $scope.gitHubURL = $scope.getGitHubURL($scope.containerObj.gitUrl);
                $scope.quayIOURL = $scope.getQuayIOURL($scope.containerObj.path);
              });
          } else {
            $scope.infoEditMode = false;
            $scope.resetContainerEditData($scope.containerObj);
            $scope.gitHubURL = $scope.getGitHubURL($scope.containerObj.gitUrl);
            $scope.quayIOURL = $scope.getQuayIOURL($scope.containerObj.path);
          }
        }
      });

  }]);

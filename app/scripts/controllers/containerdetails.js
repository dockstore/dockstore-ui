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

      $scope.loadContainerDetails = function(containerPath) {
        $scope.setContainerDetailsError(null);
        return ContainerService.getRegisteredContainerByPath(containerPath)
          .then(
            function(containerObj) {
              $scope.containerObj = containerObj;
            },
            function(response) {
              $scope.setContainerDetailsError(
                'The webservice encountered an error trying to retrieve this ' +
                'container, please ensure that the container exists and is ' +
                'registered for public access.',
                '[' + response.status + '] ' + response.statusText
              );
              return $q.reject(response);
            }
          );
      };

      $scope.setContainerRegistration = function(containerId, isRegistered) {
        $scope.setContainerDetailsError(null);
        return ContainerService.setContainerRegistration(containerId, isRegistered)
          .then(
            function(containerObj) {
              $scope.containerObj.is_registered = containerObj.is_registered;
              $scope.updateContainerObj();
              return containerObj;
            },
            function(response) {
              $scope.setContainerDetailsError(
                'The webservice encountered an error trying to register this ' +
                'container, please ensure that the associated Dockerfile and ' +
                'Dockstore.cwl descriptor are valid and accessible.',
                '[' + response.status + '] ' + response.statusText
              );
              return $q.reject(response);
            }
          ).finally(function(response) {
            $scope.containerEditData.isRegistered = $scope.containerObj.is_registered;
          });
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
          labels: labels,
          isRegistered: containerObj.is_registered
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

      $scope.getDaysAgo = function(timestamp) {
        var timeDiff = (new Date()).getTime() - timestamp;
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      };

      $scope.getDaysAgoString = function(timestamp) {
        var daysAgo = $scope.getDaysAgo(timestamp);
        return daysAgo.toString() +
                ((daysAgo === 1) ? ' day ago' : ' days ago');
      };

      $scope.getGitReposProvider = function() {
        if ($scope.containerObj.gitUrl.indexOf('github.com') !== -1) {
          return 'github.com';
        } else if ($scope.containerObj.gitUrl.indexOf('bitbucket.org') !== -1) {
          return 'bitbucket.org';
        } else {
          return 'unknown';
        }
      };

      $scope.getGitHubURL = function(containerGitUrl) {
        if (containerGitUrl.length <= 0) return;
        var gitHubRegexp = /^git@github.com:(.*)\/(.*).git$/i;
        var matchRes = gitHubRegexp.exec(containerGitUrl);
        return matchRes ? 'https://github.com/' + matchRes[1] + '/' + matchRes[2] : 'n/a';
      };

      $scope.getBitbucketURL = function(containerGitUrl) {
        if (containerGitUrl.length <= 0) return;
        var bitbucketRegexp = /^git@bitbucket.org:(.*)\/(.*).git$/i;
        var matchRes = bitbucketRegexp.exec(containerGitUrl);
        return matchRes ? 'https://bitbucket.org/' + matchRes[1] + '/' + matchRes[2] : 'n/a';
      };

      $scope.getQuayIOURL = function(containerPath) {
        if (containerPath.length <= 0) return;
        var quayIOPathRegexp = /^quay\.io\/(.*)\/(.*)$/i;
        var matchRes = quayIOPathRegexp.exec(containerPath);
        return matchRes ? 'https://quay.io/repository/' + matchRes[1] + '/' + matchRes[2] : 'n/a';
      };

      $scope.updateInfoURLs = function() {
        $scope.gitReposProvider = $scope.getGitReposProvider();
        if ($scope.gitReposProvider === 'github.com') {
          $scope.gitReposProviderName = 'GitHub';
          $scope.gitReposProviderURL =
              $scope.getGitHubURL($scope.containerObj.gitUrl);
        } else if ($scope.gitReposProvider === 'bitbucket.org') {
          $scope.gitReposProviderName = 'Bitbucket';
          $scope.gitReposProviderURL =
              $scope.getBitbucketURL($scope.containerObj.gitUrl);
        }
        $scope.quayIOURL = $scope.getQuayIOURL($scope.containerObj.path);
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

      $scope.toggleLabelsEditMode = function() {
        $scope.labelsEditMode = !$scope.labelsEditMode;
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

      $scope.$watch('containerPath', function(newValue, oldValue) {
        if (newValue) {
          $scope.setContainerDetailsError(null);
          if (!$scope.editMode) {
            $scope.loadContainerDetails($scope.containerPath)
              .then(function(containerObj) {
                $scope.updateInfoURLs();
              });
          } else {
            $scope.labelsEditMode = false;
            $scope.resetContainerEditData($scope.containerObj);
            $scope.updateInfoURLs();
          }
        }
      });

  }]);

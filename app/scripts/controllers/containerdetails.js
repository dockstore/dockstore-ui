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
      if (!$scope.activeTabs) {
        $scope.activeTabs = [true];
        for (var i = 0; i < 4; i++) $scope.activeTabs.push(false);
      }

      $scope.loadContainerDetails = function(containerPath) {
        $scope.setContainerDetailsError(null);
        return ContainerService.getRegisteredContainerByToolPath(containerPath)
          .then(
            function(containerObj) {
              $scope.containerObj = containerObj;
            },
            function(response) {
              $scope.setContainerDetailsError(
                'The webservice encountered an error trying to retrieve this ' +
                'container, please ensure that the container exists and is ' +
                'registered for public access.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
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
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          ).finally(function(response) {
            $scope.containerEditData.isRegistered = $scope.containerObj.is_registered;
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

      $scope.toggleLabelsEditMode = function() {
        $scope.labelsEditMode = !$scope.labelsEditMode;
      };

      $scope.getDockerPullCmd = function(path) {
        return FrmttSrvc.getFilteredDockerPullCmd(path);
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

      $scope.$watch('containerToolname', function(newValue, oldValue) {
        if (newValue) $scope.updateInfoURLs();
      });

  }]);

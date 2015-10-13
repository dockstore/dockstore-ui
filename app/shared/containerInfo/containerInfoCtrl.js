angular.module('dockstore.ui')
  .controller('ContainersInfoCtrl',
      ['$scope', 'ContainerService', 'UserService', 'NtfnService',
      function($scope, ContainerService, UserService, NtfnService) {

    /* Being Changed */
    $scope.loadContainerDetails = function(contId) {
      NtfnService.popInfo('Docker Container Details',
        'Retrieving container metadata.');
      ContainerService.getDockerContainer(contId)
        .then(function(contObj) {
          NtfnService.clearAll();
          $scope.contObj = contObj;
        })
        .catch(function(response) {
          var message = (typeof response.statusText != 'undefined') ?
            response.statusText : 'Unknown Error.';
          NtfnService.popError('Docker Container Details', message);
        });
    };

    $scope.getVersionTags = function(contObj) {
      var version_tags = [];
      if (contObj.hasOwnProperty('tags')) {
        for (var i = 0; i < contObj.tags.length; i++) {
          version_tags.push(contObj.tags[i].version);
        }
      }
      if (version_tags.length == 0) version_tags.push('n/a');
      return version_tags;
    };

  }]);

angular.module('dockstore.ui')
  .controller('ContainersEditorCtrl',
      ['$scope', 'DockerRepoService', 'UserService', 'NtfnService',
      function($scope, DockerRepoService, UserService, NtfnService) {

    var collectNSContainers = function(containers) {
      var ns_cont = [];
      var getIndexByNS = function(namespace) {
        for (var i = 0; i < ns_cont.length; i++) {
          if (ns_cont[i].namespace === namespace) return i;
        }
        return -1;
      }
      for (var i = 0; i < containers.length; i++) {
        var ns_ind = getIndexByNS(containers[i].namespace);
        if (ns_ind > -1) {
          ns_cont[ns_ind].containers.push(containers[i]);
        } else {
          ns_cont.push({
            namespace: containers[i].namespace,
            containers: [containers[i]]
          });
        }
      }
      return ns_cont;
    };

    NtfnService.popInfo('List Account Containers', 'Loading container list...');
    DockerRepoService.getUserRegisteredContainers(UserService.getUserObj().id)
      .then(function(containers) {
        NtfnService.clearAll();
        $scope.nsObjContainers = collectNSContainers(containers);
      }, function(response) {
        var message = (typeof response.statusText != 'undefined') ?
          response.statusText : 'Unknown Error.';
        NtfnService.popError('Account Containers', message);
      });

    $scope.selectContainer = function(cont_id) {
      console.log('Container:', cont_id, ' Selected for modification.');
    };

  }]);

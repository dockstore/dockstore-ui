angular.module('dockstore.ui')
  .controller('ContainersEditorCtrl',
      ['$scope', 'ContainerService', 'UserService', 'NtfnService',
      function($scope, ContainerService, UserService, NtfnService) {

    var collectContObjsByNS = function(conts) {
      var ns_cont = [];
      var getIndexByNS = function(namespace) {
        for (var i = 0; i < ns_cont.length; i++) {
          if (ns_cont[i].namespace === namespace) return i;
        }
        return -1;
      }
      for (var i = 0; i < conts.length; i++) {
        var ns_ind = getIndexByNS(conts[i].namespace);
        if (ns_ind > -1) {
          ns_cont[ns_ind].conts.push(conts[i]);
        } else {
          ns_cont.push({
            namespace: conts[i].namespace,
            conts: [conts[i]]
          });
        }
      }
      return ns_cont;
    };

    NtfnService.popInfo('List Account Containers', 'Loading container list...');
    ContainerService.getUserRegisteredContainers(UserService.getUserObj().id)
      .then(function(conts) {
        NtfnService.clearAll();
        $scope.nsContObjs = collectContObjsByNS(conts);
      }, function(response) {
        var message = (typeof response.statusText != 'undefined') ?
          response.statusText : 'Unknown Error.';
        NtfnService.popError('Account Containers', message);
      });

    $scope.loadCollabJSON = function(cont_path) {
      if (!cont_path) return;
      NtfnService.popInfo('Docker Container Details',
        'Retrieving collab.json file...');
      ContainerService.getCollabJSON(cont_path)
        .then(function(collab) {
          NtfnService.clearAll();
          console.log('collab:', collab);
          $scope.collab_json_text = collab;
        }, function(response) {
          var message = (typeof response.statusText != 'undefined') ?
            response.statusText : 'Unknown Error.';
          NtfnService.popError('Docker Container Details', message);
        });
    };

    $scope.selectContainer = function(cont_id, cont_path) {
      $scope.selContId = cont_id;
      $scope.selContPath = cont_path;
    };

  }]);

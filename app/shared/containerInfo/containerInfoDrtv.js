angular.module('dockstore.ui')
  .directive('containerInfo', function() {
    return {
      restrict: 'AE',
      controller: 'ContainersInfoCtrl',
      scope: {
        contId: '=',
        reqAccess: '=',
        contName: '=',
        contNamespace: '='
      },
      templateUrl: 'app/shared/containerInfo/containerInfoTmpl.html?'+Math.random(),
      link: function(scope, element, attrs) {
        scope.$watch('contId', function(newVal, oldVal) {
          if (newVal) scope.loadContainerDetails(newVal);
        });
      }
    };
  });

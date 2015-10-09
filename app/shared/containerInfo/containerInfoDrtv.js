angular.module('dockstore.ui')
  .directive('containersInfo', function() {
    return {
      restrict: 'AE',
      controller: 'ContainersInfoCtrl',
      templateUrl: 'app/shared/containerInfo/containerInfoDrtv.js?'+Math.random()/*,
      link: function(scope, element, attrs) {
        
      }*/
    };
  });

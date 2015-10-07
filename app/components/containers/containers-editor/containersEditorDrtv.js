angular.module('dockstore.ui')
  .directive('containersEditor', function() {
    return {
      restrict: 'AE',
      controller: 'ContainersEditorCtrl',
      templateUrl: 'app/components/containers/container-editor/containerEditorTmpl.html'/*,
      link: function(scope, element, attrs) {
        
      }*/
    };
  });

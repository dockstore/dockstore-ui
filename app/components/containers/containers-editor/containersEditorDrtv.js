angular.module('dockstore.ui')
  .directive('containersEditor', function() {
    return {
      restrict: 'AE',
      controller: 'ContainersEditorCtrl',
      templateUrl: 'app/components/containers/containers-editor/containersEditorTmpl.html'/*,
      link: function(scope, element, attrs) {
        
      }*/
    };
  });

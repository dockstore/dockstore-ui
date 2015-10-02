angular.module('dockstore.ui')
  .directive('dockerContainerGrid', function() {
    return {
      restrict: 'A',
      templateUrl: 'app/shared/dockerContGrid/dockerContGridTmpl.html',
      link: function(scope, element, attrs) {
        scope.$watch('dockerContainerList', function(newVal, oldVal) {
          if (newVal) $(element).find('table').DataTable();
        }, true);
      }
    };
  });

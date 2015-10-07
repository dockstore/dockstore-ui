angular.module('dockstore.ui')
  .directive('dockerContainerGrid', function() {
    return {
      restrict: 'AE',
      templateUrl: 'app/components/search/container-grid/containerGridTmpl.html',
      link: function(scope, element, attrs) {
        scope.$watch('dockerContainerList', function(newVal, oldVal) {
          if (newVal) {
            $(element).find('table').DataTable({
              columns: [
                { width: '40%' },
                { width: '20%' },
                { width: '40%' }
              ]
            });
          }
        }, true);
      }
    };
  });

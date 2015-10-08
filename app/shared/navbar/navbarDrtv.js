angular.module('dockstore.ui')
  .directive('navbar', function() {
    return {
      restrict: 'AE',
      controller: 'NavbarCtrl',
      templateUrl: 'app/shared/navbar/navbarTmpl.html',
      link: function(scope, element, attrs) {
        scope.$on('userObjRefresh', function(event, userObj) {
          scope.username = userObj ? userObj.username : '';
        });
      }
    };
  });

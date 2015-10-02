angular.module('dockstore.ui')
  .directive('navbar', function() {
    return {
      restrict: 'A',
      controller: 'NavbarCtrl',
      templateUrl: 'app/shared/navbar/navbarTmpl.html'
    };
  });

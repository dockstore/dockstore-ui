angular.module('dockstore.ui')
  .directive('navbar', function() {
    return {
      restrict: 'AE',
      controller: 'NavbarCtrl',
      templateUrl: 'app/shared/navbar/navbarTmpl.html'
    };
  });

angular.module('dockstore.ui',
    ['ngRoute', 'ngAnimate', 'LocalStorageModule', 'satellizer',
      'ui.bootstrap', 'toaster'])
  .constant('WebService', {
    API_URL: 'http://localhost:8080',
    API_URL_DEBUG: 'http://localhost:8090/tests/dummy-data',
    DEBUG_MODE: true
  })
  .config(['$authProvider', function($authProvider) {
    /* This is a work-around to get Satellizer to work w/
          non-standard web service tokens. */
    $authProvider.baseUrl = 'http://localhost:8080/';
      $authProvider.github({
        clientId: 'a70739297a7d67f915de'
      });
  }])
  .config(['localStorageServiceProvider',
      function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('dks-ui');
  }])
  .run(['$rootScope', '$auth', '$location',
      function($rootScope, $auth, $location) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      var public_views = ['/search', '/docs', '/login', '/register'];
      var isViewPublic = function(path) {
        for (var i = 0; i < public_views.length; i++) {
          if (path.indexOf(public_views[i]) !== -1) return true;
        }
        return false;
      };
      if (!$auth.isAuthenticated() && !isViewPublic($location.url())) {
        $location.path('/login');
      }
    });
  }]);

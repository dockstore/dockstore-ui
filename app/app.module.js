angular.module('dockstore.ui',
    ['ngRoute', 'ngAnimate', 'LocalStorageModule', 'satellizer',
      'ui.bootstrap', 'toaster'])
  .constant('WebService', {
    API_URL: 'http://localhost:8080',
    API_URL_DEBUG: 'http://localhost:8090/tests/dummy-data',
    DEBUG_MODE: true,
    GITHUB_AUTH_URL: 'https://github.com/login/oauth/authorize',
    GITHUB_CLIENT_ID: '8835e744db0ed77dd3b0',
    GITHUB_REDIRECT_URI: 'http://localhost:8090/login',
    GITHUB_SCOPE: 'read:org',
    QUAYIO_AUTH_URL: 'https://quay.io/oauth/authorize',
    QUAYIO_CLIENT_ID: 'XWGF22T0VWWL579SFAAD',
    QUAYIO_REDIRECT_URI: 'http://localhost:8090/accounts',
    QUAYIO_SCOPE: 'repo:read,user:read'
  })
  .config(['$authProvider', 'WebService', function($authProvider, WebService) {
    /* This is a work-around to get Satellizer to work w/
          non-standard web service tokens. */
    $authProvider.baseUrl = 'http://localhost:8080/';
      $authProvider.github({
        clientId: WebService.GITHUB_CLIENT_ID,
        redirectUri: WebService.GITHUB_REDIRECT_URI,
        scope: [WebService.GITHUB_SCOPE]
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

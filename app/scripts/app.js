'use strict';

/**
 * @ngdoc overview
 * @name dockstore.ui
 * @description
 * # dockstore.ui
 *
 * Main module of the application.
 */
angular
  .module('dockstore.ui', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'satellizer',
    'LocalStorageModule',
    'toaster'
  ])
  .config(['$authProvider', 'WebService',
    function($authProvider, WebService) {
      /* This is a work-around to get Satellizer to work w/
            non-standard web service tokens. */
      $authProvider.baseUrl = 'http://localhost:8080/';
        $authProvider.github({
          clientId: WebService.GITHUB_CLIENT_ID,
          scope: [WebService.GITHUB_SCOPE]
        });
  }])
  .config(['localStorageServiceProvider',
    function(localStorageServiceProvider) {
      localStorageServiceProvider.setPrefix('dockstore.ui');
  }])
  .config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          controllerAs: 'main'
        })
        .when('/about', {
          templateUrl: 'views/about.html',
          controller: 'AboutCtrl',
          controllerAs: 'about'
        })
        .when('/login', {
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl',
          controllerAs: 'Login'
        })
        .when('/search', {
          templateUrl: 'views/search.html',
          controller: 'SearchCtrl',
          controllerAs: 'Search'
        })
        .otherwise({
          redirectTo: '/search'
        });
      //$locationProvider.html5Mode(true);
  }]).run(['$rootScope', '$auth', '$location',
    function($rootScope, $auth, $location) {
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        var public_views = ['/search', '/docs', '/login', '/register'];
        var isViewPublic = function(path) {
          for (var i = 0; i < public_views.length; i++) {
            if (path.indexOf(public_views[i]) !== -1) { return true; }
          }
          return false;
        };
        if (!$auth.isAuthenticated() && !isViewPublic($location.url())) {
          $location.path('/login');
        }
      });
  }]);

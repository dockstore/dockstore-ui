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
    'ngMessages',
    'satellizer',
    'LocalStorageModule',
    'ui.bootstrap',
    'toaster',
    'hc.marked',
    'hljs'
  ])
  .config(['$authProvider', 'WebService',
    function($authProvider, WebService) {
      /* This is a work-around to get Satellizer to work w/
            non-standard web service tokens. */
      $authProvider.baseUrl = WebService.API_URI + '/';
      $authProvider.github({
        clientId: WebService.GITHUB_CLIENT_ID,
        redirectUri: WebService.GITHUB_REDIRECT_URI,
        scope: [WebService.GITHUB_SCOPE]
      });
  }])
  .config(['localStorageServiceProvider',
    function(localStorageServiceProvider) {
      localStorageServiceProvider.setPrefix('dockstore.ui');
  }])
  .config(['hljsServiceProvider',
    function(hljsServiceProvider) {
      hljsServiceProvider.setOptions({
        tabReplace: '    '
      });
  }])
  .config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
      $routeProvider
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
        .when('/search/:containerId', {
          templateUrl: 'views/searchcontainerdetails.html',
          controller: 'SearchContainerDetailsCtrl',
          controllerAs: 'SearchContainerDetails'
        })
        .when('/containers', {
          templateUrl: 'views/containers.html',
          controller: 'ContainersCtrl',
          controllerAs: 'Containers'
        })
        .when('/containers/register', {
          templateUrl: 'views/registercontainer.html',
          controller: 'RegisterContainerCtrl',
          controllerAs: 'RegisterContainer'
        })
        .when('/docs', {
          templateUrl: 'views/documentation.html',
          controller: 'DocumentationCtrl',
          controllerAs: 'Documentation'
        })
        .when('/docs/:urlSlug', {
          templateUrl: 'views/document.html',
          controller: 'DocumentCtrl',
          controllerAs: 'Document'
        })
        .when('/onboarding', {
          templateUrl: 'views/onboarding.html',
          controller: 'OnboardingCtrl',
          controllerAs: 'Onboarding'
        })
        .when('/accounts', {
          templateUrl: 'views/accounts.html',
          controller: 'AccountsCtrl',
          controllerAs: 'Accounts'
        })
        .when('/tokens', {
          templateUrl: 'views/tokens.html',
          controller: 'TokensCtrl',
          controllerAs: 'Tokens'
        })
        .when('/settings', {
          templateUrl: 'views/settings.html',
          controller: 'SettingsCtrl',
          controllerAs: 'Settings'
        })
        .when('/', {
          templateUrl: 'views/home.html',
          controller: 'HomeCtrl',
          controllerAs: 'Home'
        })
        .otherwise({
          redirectTo: '/'
        });
      $locationProvider.html5Mode(true);
  }])
  .factory('authHttpResponseInterceptor', [
      '$q',
      '$rootScope',
      function($q, $rootScope) {
        return {
          response: function(response) {
            if (response.status === 401) {
              $rootScope.$emit('auth401Refused');
            }
            return response || $q.when(response);
          },
          responseError: function(rejection) {
            if (rejection.status === 401) {
              $rootScope.$emit('auth401Refused');
            }
            return $q.reject(rejection);
          }
        };
  }])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
  }])
  .run(['$rootScope', '$auth', '$location', 'UserService',
    function($rootScope, $auth, $location, UserService) {
      $rootScope.$on('auth401Refused', function(event) {
        UserService.logout({
          title: 'Dockstore Web Service',
          content: 'Invalid token or authorization denied, please sign in again.'
        });
      });
      $rootScope.$on('searchQueryChange', function(event, searchQuery) {
        if ($location.url() !== 'search' && searchQuery) {
          $location.path('/search');
        }
      });
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if ($location.url() === '/') return;
        var public_views = ['/search', '/docs', '/login', '/register'];
        var isViewPublic = function(path) {
          for (var i = 0; i < public_views.length; i++) {
            if (path.indexOf(public_views[i]) !== -1) { return true; }
          }
          return false;
        };
        if ($auth.isAuthenticated()) {
          if ($location.url() === '/login') $location.path('/');
        } else {
          if (!isViewPublic($location.url())) $location.path('/login');
        }
      });
  }]);

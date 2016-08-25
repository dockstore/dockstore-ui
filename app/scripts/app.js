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
    'hljs',
    'hc.marked',
    'sn.addthis'
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
  .config(['markedProvider', function (markedProvider) {
    markedProvider.setOptions({
      gfm: true,
      tables: true,
      breaks: true,
      sanitize: true
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
        .when('/search-containers/:searchQueryContainer?', {
          templateUrl: 'views/search.html',
          controller: 'SearchCtrl',
          controllerAs: 'Search'
        })
        .when('/search-workflows/:searchQueryWorkflow?', {
          templateUrl: 'views/searchworkflow.html',
          controller: 'SearchWorkflowCtrl',
          controllerAs: 'SearchWorkflow'
        })
        .when('/containers/:containerPath*', {
          templateUrl: 'views/containerviewer.html',
          controller: 'ContainerViewerCtrl',
          controllerAs: 'ContainerViewer'
        })
        .when('/workflows/:workflowPath*', {
          templateUrl: 'views/workflowviewer.html',
          controller: 'WorkflowViewerCtrl',
          controllerAs: 'WorkflowViewer'
        })
        .when('/my-containers', {
          templateUrl: 'views/containereditor.html',
          controller: 'ContainerEditorCtrl',
          controllerAs: 'ContainerEditor'
        })
        .when('/my-containers/publish', {
          templateUrl: 'views/registercontainer.html',
          controller: 'RegisterContainerCtrl',
          controllerAs: 'RegisterContainer'
        })
        .when('/my-workflows', {
          templateUrl: 'views/workfloweditor.html',
          controller: 'WorkflowEditorCtrl',
          controllerAs: 'WorkflowEditor'
        })
        .when('/my-containers/publish', {
          templateUrl: 'views/registerworkflow.html',
          controller: 'RegisterWorkflowCtrl',
          controllerAs: 'RegisterWorkflow'
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
        .when('/auth/:provider*', {
          templateUrl: 'views/authentication.html',
          controller: 'AuthenticationCtrl',
          controllerAs: 'Authentication'
        })
        .when('/', {
          templateUrl: 'views/home.html',
          controller: 'HomeCtrl',
          controllerAs: 'Home'
        })
        .when('/maintenance', {
          templateUrl: 'views/maintenance.html',
          controller: 'MaintenanceCtrl',
          controllerAs: 'Maintenance'
        })
        .otherwise({
          redirectTo: '/'
        });
      $locationProvider.html5Mode(true);
  }])
  .factory('webserviceResponseInterceptor', [
      '$q',
      '$window',
      function($q, $window) {
        return {
          responseError: function(rejection) {
            if (rejection.status === -1 && $window.location.pathname !== '/maintenance') {
              $window.location.href = '/maintenance';
              return;
            }
            return $q.reject(rejection);
          }
        };
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
    $httpProvider.interceptors.push('webserviceResponseInterceptor');
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
  }])
  .run(['$rootScope', '$auth', '$location', 'UserService',
    function($rootScope, $auth, $location, UserService) {
      $rootScope.$on('auth401Refused', function() {
        UserService.logout({
          title: 'Dockstore Web Service',
          content: 'Invalid token or authorization denied, please sign in again.'
        });
      });
      $rootScope.$watch('searchQueryContainer', function(newValue) {
        if (newValue) $location.path('/search-containers');
      });
      $rootScope.$watch('searchQueryWorkflow', function(newValue) {
        if (newValue) $location.path('/search-workflows');
      });
      $rootScope.$on('$routeChangeStart', function() {
        if ($location.url() === '/') return;
        var public_views = [
          '/search-containers', '/containers', '/docs', '/login', '/publish', 'maintenance', '/workflows', '/search-workflows'
        ];
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

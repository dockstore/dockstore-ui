/*
 *    Copyright 2016 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

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
    'sn.addthis',
    'ngclipboard',
    'angular-md5'
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
    }
  ])
  .config(['localStorageServiceProvider',
    function(localStorageServiceProvider) {
      localStorageServiceProvider.setPrefix('dockstore.ui');
    }
  ])
  .config(['hljsServiceProvider',
    function(hljsServiceProvider) {
      hljsServiceProvider.setOptions({
        tabReplace: '    '
      });
    }
  ])
  .config(['markedProvider', function(markedProvider) {
    markedProvider.setOptions({
      gfm: true,
      tables: true,
      breaks: true,
      sanitize: true,
      smartypants: true
    });
  }])
  .config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/login', {
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl',
          controllerAs: 'Login'
        })
        .when('/starred', {
          templateUrl: 'views/starred.html',
          controller: 'StarredCtrl',
          controllerAs: 'Starred'
        })
        .when('/search-containers', {
          templateUrl: 'views/search.html',
          controller: 'SearchCtrl',
          controllerAs: 'Search',
          reloadOnSearch: false
        })
        .when('/search-workflows', {
          templateUrl: 'views/searchworkflow.html',
          controller: 'SearchWorkflowCtrl',
          controllerAs: 'SearchWorkflow',
          reloadOnSearch: false
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
        .when('/docs/:urlSlug/#', {
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
        .when('/organizations', {
          templateUrl: 'views/organizations.html',
          controller: 'OrganizationsCtrl',
          controllerAs: 'Organizations'
        })
        .otherwise({
          redirectTo: '/'
        });
      $locationProvider.html5Mode(true);
    }
  ])
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
    }
  ])
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
    }
  ])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('webserviceResponseInterceptor');
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
  }])
  .run(['$rootScope', '$auth', '$location', 'UserService', 'FormattingService',
    function($rootScope, $auth, $location, UserService, FrmttSrvc) {
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
          '/search-containers', '/containers', '/docs', '/login', '/publish', 'maintenance', '/workflows', '/search-workflows', '/organizations'
        ];
        var isViewPublic = function(path) {
          for (var i = 0; i < public_views.length; i++) {
            if (path.indexOf(public_views[i]) !== -1) {
              return true;
            }
          }
          return false;
        };
        if ($auth.isAuthenticated()) {
          if ($location.url() === '/login') $location.path('/');
        } else {
          if (!isViewPublic($location.url())) $location.path('/login');
        }
      });

      // Initialize the list of docker registries supported for manual tools
      FrmttSrvc.getDockerRegistryList();
    }
  ]);

angular.module('dockstore.ui')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/search', {
        templateUrl: 'app/components/search/searchView.html',
        controller: 'SearchCtrl'
      })
      // .when('/search/:contId', {
      //   templateUrl: 'app/components/search/contView.html',
      //   controller: 'ContCtrl'
      // })
      .when('/console', {
        templateUrl: 'app/components/console/consoleView.html',
        controller: 'ConsoleCtrl'
      })
      .when('/docs', {
        templateUrl: 'app/components/docs/docsView.html',
        controller: 'DocsCtrl'
      })
      // .when('/accounts', {
      //   templateUrl: 'app/components/docs/accountsView.html',
      //   controller: 'AccountsCtrl'
      // })
      // .when('/tokens', {
      //   templateUrl: 'app/components/docs/tokensView.html',
      //   controller: 'TokensCtrl'
      // })
      // .when('/settings', {
      //   templateUrl: 'app/components/settings/settingsView.html',
      //   controller: 'SettingsCtrl'
      // })
      .when('/login', {
        templateUrl: 'app/components/login/loginView.html',
        controller: 'LoginCtrl'
      })
      // .when('/register', {
      //   templateUrl: 'app/components/register/registerView.html',
      //   controller: 'RegisterCtrl'
      // })
      .otherwise({
        redirectTo: '/search'
      });
  }]);

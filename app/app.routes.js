angular.module('dockstore.ui')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/search', {
        templateUrl: 'app/components/search/searchView.html',
        controller: 'SearchCtrl'
      })
      // .when('/console', {
      //   templateUrl: 'components/console/consoleView.html',
      //   controller: 'ConsoleCtrl'
      // })
      // .when('/docs', {
      //   templateUrl: 'components/docs/docsView.html',
      //   controller: 'DocsCtrl'
      // })
      // .when('/accounts', {
      //   templateUrl: 'components/docs/accountsView.html',
      //   controller: 'AccountsCtrl'
      // })
      // .when('/tokens', {
      //   templateUrl: 'components/docs/tokensView.html',
      //   controller: 'TokensCtrl'
      // })
      // .when('/settings', {
      //   templateUrl: 'components/settings/settingsView.html',
      //   controller: 'SettingsCtrl'
      // })
      .when('/login', {
        templateUrl: 'app/components/login/loginView.html',
        controller: 'LoginCtrl'
      })
      // .when('/register', {
      //   templateUrl: 'components/register/registerView.html',
      //   controller: 'RegisterCtrl'
      // })
      .otherwise({
        redirectTo: '/search'
      });
  }]);

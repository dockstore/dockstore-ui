angular.module('dockstore.ui')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/search', {
        templateUrl: 'app/components/search/searchView.html',
        controller: 'SearchCtrl'
      })
      .when('/search/:contId', {
        templateUrl: 'app/components/search/container-details/' +
                      'containerDetailsView.html',
        controller: 'SearchContainerCtrl'
      })
      .when('/containers', {
        templateUrl: 'app/components/containers/containersView.html',
        controller: 'ContainersCtrl'
      })
      .when('/containers/add', {
        templateUrl: 'app/components/containers/addContainerView.html',
        controller: 'AddContainerCtrl'
      })
      .when('/docs', {
        templateUrl: 'app/components/docs/docsView.html',
        controller: 'DocumentationCtrl'
      })
      .when('/accounts', {
        templateUrl: 'app/components/accounts/accountsView.html',
        controller: 'AccountsCtrl'
      })
      .when('/tokens', {
        templateUrl: 'app/components/tokens/tokensView.html',
        controller: 'TokensCtrl'
      })
      .when('/settings', {
        templateUrl: 'app/components/settings/settingsView.html',
        controller: 'SettingsCtrl'
      })
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

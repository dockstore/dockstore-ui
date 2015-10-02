angular.module('dockstore.ui', ['ngRoute', 'satellizer', 'ui.bootstrap'])
	.constant('WebService', {
		API_URL: 'http://localhost:8080'
	})
	.config(['$authProvider', function($authProvider) {
		/* This is a work-around to get Satellizer to work w/
	        non-standard webservice tokens. */
	    $authProvider.baseUrl = 'http://localhost:8080/';
	      $authProvider.github({
	        clientId: 'a70739297a7d67f915de'
	      });
	}])
	.run(['$rootScope', '$auth', '$location',
		function($rootScope, $auth, $location) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      var public_views = ['/search', '/documentation', '/login', '/register'];
      if (!$auth.isAuthenticated() &&
          public_views.indexOf($location.url()) === -1) {
        $location.path('/login');
      }
    });
  }]);

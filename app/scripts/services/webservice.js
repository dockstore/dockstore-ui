'use strict';

/**
 * @ngdoc service
 * @name dockstore.ui.WebService
 * @description
 * # WebService
 * Constant in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .constant('WebService', {
    API_URI: 'http://www.dockstore.org:8080',
    API_URI_DEBUG: 'http://www.dockstore.org/tests/dummy-data',

    GITHUB_AUTH_URL: 'https://github.com/login/oauth/authorize',
    GITHUB_CLIENT_ID: '41b685026f5effa17069',
    GITHUB_REDIRECT_URI: 'http://www.dockstore.org/%23/login',
    GITHUB_SCOPE: 'read:org',
    
    QUAYIO_AUTH_URL: 'https://quay.io/oauth/authorize',
    QUAYIO_CLIENT_ID: 'XWGF22T0VWWL579SFAAD',
    QUAYIO_REDIRECT_URI: 'http://www.dockstore.org/%23/onboarding',
    QUAYIO_SCOPE: 'repo:read,user:read'
  });

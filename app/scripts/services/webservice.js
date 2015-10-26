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
    GITHUB_CLIENT_ID: '7ad54aa857c6503013ea',
    GITHUB_REDIRECT_URI: 'http://www.dockstore.org/%23/login',
    GITHUB_SCOPE: 'read:org',
    
    QUAYIO_AUTH_URL: 'https://quay.io/oauth/authorize',
    QUAYIO_CLIENT_ID: 'X5HST9M57O6A57GZFX6T',
    QUAYIO_REDIRECT_URI: 'http://www.dockstore.org/%23/onboarding',
    QUAYIO_SCOPE: 'repo:read,user:read'
  });

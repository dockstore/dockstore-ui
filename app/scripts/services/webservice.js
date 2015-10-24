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
    API_URI: 'http://localhost:8080',
    API_URI_DEBUG: 'http://localhost:8090/tests/dummy-data',

    GITHUB_AUTH_URL: 'https://github.com/login/oauth/authorize',
    GITHUB_CLIENT_ID: 'a70739297a7d67f915de',
    GITHUB_REDIRECT_URI: '',
    GITHUB_SCOPE: 'read:org',
    
    QUAYIO_AUTH_URL: 'https://quay.io/oauth/authorize',
    QUAYIO_CLIENT_ID: 'RWCBI3Y6QUNXDPYKNLMC',
    QUAYIO_REDIRECT_URI: 'http://localhost:9000/%23/onboarding',
    QUAYIO_SCOPE: 'repo:read,user:read'
  });

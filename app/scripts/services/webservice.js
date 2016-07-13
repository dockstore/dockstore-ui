'use strict';

/**
 * @ngdoc service
 * @name dockstore.ui.WebService
 * @description
 * # WebService
 * Constant in the dockstore.ui.
 */

/*
 * >>>> DO NOT COMMIT THIS FILE <<<<, use locally:
 * git update-index --assume-unchanged app/scripts/services/webservice.js
 */

angular.module('dockstore.ui')
  .constant('WebService', {
    API_CROSS_URI: '<fill me in>',
    API_URI: 'http://localhost:8080',
    API_URI_DEBUG: 'http://localhost:9000/tests/dummy-data',

    GITHUB_AUTH_URL: 'https://github.com/login/oauth/authorize',
    GITHUB_CLIENT_ID: 'a70739297a7d67f915de',
    GITHUB_REDIRECT_URI: 'http://localhost:9000/login',
    GITHUB_SCOPE: 'read:org',

    QUAYIO_AUTH_URL: 'https://quay.io/oauth/authorize',
    QUAYIO_CLIENT_ID: 'RWCBI3Y6QUNXDPYKNLMC',
    QUAYIO_REDIRECT_URI: 'http://localhost:9000/auth/quay.io',
    QUAYIO_SCOPE: 'repo:read,user:read',

    BITBUCKET_AUTH_URL: 'https://bitbucket.org/site/oauth2/authorize',
    BITBUCKET_CLIENT_ID: 'K9VxydpaXKCgxxVpbx',

    DSCLI_RELEASE_URL: 'https://github.com/ga4gh/dockstore/' +
                        'releases/download/0.3-alpha.0/dockstore'
  });

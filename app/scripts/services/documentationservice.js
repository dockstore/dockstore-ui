'use strict';

/**
 * @ngdoc service
 * @name dockstore.ui.DocumentationService
 * @description
 * # DocumentationService
 * Service in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .service('DocumentationService', [
    function () {

      this.docObjs = [
        {
          slug: 'getting-started',
          description: 'This tutorial walks through how to register at Dockstore and then share simple tools',
          name: 'Getting Started',
          path: 'docs/getting-started.md'
        },
        {
          slug: 'about',
          description: 'This document gives background on Dockstore and what we are trying to accomplish',
          name: 'About Dockstore',
          path: 'docs/about.md'
        },
        {
          slug: 'workflows',
          description: 'This tutorial walks through how to register and share more complex workflows',
          name: 'Workflows',
          path: 'docs/workflows.md'
        },
        {
          slug: 'launch',
          description: 'This tutorial walks through how to launch tools and workflows hosted at Dockstore',
          name: 'Launching Tools and Workflows',
          path: 'docs/launch.md'
        }
      ];

      this.getDocumentObjs = function() {
        return this.docObjs;
      };

  }]);

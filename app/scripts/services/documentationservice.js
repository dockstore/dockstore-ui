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
          description: 'This tutorial walks through how to create your tool development environment',
          name: 'Getting Started',
          path: 'docs/getting-started.md'
        },
        {
          slug: 'getting-started-with-docker',
          description: 'This tutorial walks through how to create a Docker image',
          name: 'Getting Started with Docker',
          path: 'docs/getting-started-with-docker.md'
        },
        {
          slug: 'getting-started-with-cwl',
          description: 'This tutorial walks through how to describe a Docker image with CWL',
          name: 'Getting Started with CWL',
          path: 'docs/getting-started-with-cwl.md'
        },
        {
          slug: 'getting-started-with-dockstore',
          description: 'This tutorial walks through how to register at Dockstore and then share simple tools',
          name: 'Getting Started with Dockstore',
          path: 'docs/getting-started-with-dockstore.md'
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
        },
        {
          slug: 'blog',
          description: 'Dockstore news and events',
          name: 'News and Events',
          path: 'docs/blog.md'
        }
      ];

      this.getDocumentObjs = function() {
        return this.docObjs;
      };

  }]);

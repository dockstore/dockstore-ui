/*
 *    Copyright 2016 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

'use strict';

/**
 * @ngdoc service
 * @name dockstore.ui.Formatting
 * @description
 * # Formatting
 * Service in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .service('FormattingService', ['ContainerService',
    function (ContainerService) {
      var dockerRegistryMap = {};
      this.getHRSize = function(size) {
        if (!size) return 'n/a';
        var hrSize = '';
        var exp = Math.log(size) / Math.log(2);
        if (exp < 10) {
          hrSize = size.toFixed(2) + ' bytes';
        } else if (exp < 20) {
          hrSize = (size / Math.pow(2, 10)).toFixed(2) + ' kB';
        } else if (exp < 30) {
          hrSize = (size / Math.pow(2, 20)).toFixed(2) + ' MB';
        } else if (exp < 40) {
          hrSize = (size / Math.pow(2, 30)).toFixed(2) + ' GB';
        }
        return hrSize;
      };

      this.getDateModified = function(timestamp) {
        if (!timestamp) return 'n/a';
        var moy = ['Jan.', 'Feb.', 'Mar.', 'Apr.',
                    'May', 'Jun.', 'Jul.', 'Aug.',
                    'Sept.', 'Oct.', 'Nov.', 'Dec.'];
        var dateObj = new Date(timestamp);
        return moy[dateObj.getMonth()] + ' ' +
                dateObj.getDate() + ', ' +
                dateObj.getFullYear();
      };

      this.getDateTimeString = function(timestamp) {
        if (!timestamp) return 'n/a';
        var moy = ['Jan.', 'Feb.', 'Mar.', 'Apr.',
                    'May', 'Jun.', 'Jul.', 'Aug.',
                    'Sept.', 'Oct.', 'Nov.', 'Dec.'];
        var dateObj = new Date(timestamp);
        return moy[dateObj.getMonth()] + ' ' +
                dateObj.getDate() + ', ' +
                dateObj.getFullYear() + ' at ' +
                dateObj.toLocaleTimeString();
      };

      this.getGitReposProvider = function(gitUrl) {
        if (gitUrl.indexOf('github.com') !== -1) {
          return 'GITHUB';
        } else if (gitUrl.indexOf('bitbucket.org') !== -1) {
          return 'BITBUCKET';
        } else if (gitUrl.indexOf('gitlab.com') !== -1) {
          return 'GITLAB';
        } else {
          return null;
        }
      };

      this.getGitReposProviderName = function(providerName) {
        switch (providerName) {
          case 'GITHUB':
            return 'GitHub';
          case 'BITBUCKET':
            return 'Bitbucket';
          case 'GITLAB':
            return 'GitLab';
          default:
            return 'Unknown';
        }
      };

      this.getGitReposWebUrl = function(gitUrl, gitProvider) {
        if (!gitUrl) return null;
        var gitUrlRegExp = /^.*:(.*)\/(.*).git$/i;
        var matchRes = gitUrlRegExp.exec(gitUrl);
        if (!matchRes) return null;
        var gitWebUrl = '';
        switch (gitProvider) {
          case 'GITHUB':
            gitWebUrl = 'https://github.com/';
            break;
          case 'BITBUCKET':
            gitWebUrl = 'https://bitbucket.org/';
            break;
          case 'GITLAB':
            gitWebUrl = 'https://gitlab.com/';
            break;
          default:
            return null;
        }
        gitWebUrl += matchRes[1] + '/' + matchRes[2];
        return gitWebUrl;
      };

      this.getGitReposWebUrlFromPath = function(gitOrg, gitRepo, gitProvider) {
        if (!gitOrg && !gitRepo) return null;
        var gitWebUrl = '';
        switch (gitProvider) {
          case 'GITHUB':
            gitWebUrl = 'https://github.com/';
            break;
          case 'BITBUCKET':
            gitWebUrl = 'https://bitbucket.org/';
            break;
          case 'GITLAB':
            gitWebUrl = 'https://gitlab.com/';
            break;
          default:
            return null;
        }
        gitWebUrl += gitOrg + "/" + gitRepo;
        return gitWebUrl;
      };

      this.getImageReposProviderName = function(imageReposProvider) {
        for (var i = 0; i < dockerRegistryMap.length; i++) {
          if (imageReposProvider === dockerRegistryMap[i].enum) {
            return dockerRegistryMap[i].friendlyName;
          }
        }

        /** Return unknown if we can't find a matching Registry Type */
        return 'Unknown';
      };

      this.getImageReposWebUrl = function(path, imageReposProvider) {
        if (!path) return null;
        var imageReposRegExp = /^(.*)\/(.*)\/(.*)\/?$/i;
        var matchRes = imageReposRegExp.exec(path);
        if (!matchRes) return null;
        var imageReposWebUrl = '';
        var suffix = '';
        for (var i = 0; i < dockerRegistryMap.length; i++) {
          if (imageReposProvider === dockerRegistryMap[i].enum) {
            imageReposWebUrl = dockerRegistryMap[i].url;
            // Special cases for docker registry URLs
            if (imageReposProvider === 'DOCKER_HUB') {
              imageReposWebUrl += ((matchRes[2] !== '_') ? 'r/' : '');
            } else if (imageReposProvider === 'GITLAB') {
              suffix = '/container_registry';
            }
          }
        }

        // check that the docker registry can be linked to
        if (imageReposWebUrl === null) {
          return null;
        }

        imageReposWebUrl += matchRes[2] + '/' + matchRes[3] + suffix;
        return imageReposWebUrl;
      };

      this.getFilteredDockerPullCmd = function(path, tagName) {
        var dockerPullCmd = 'docker pull ';
        var prefix = 'registry.hub.docker.com/';
        if (path.indexOf(prefix) !== -1) path = path.replace(prefix, '');
        if (path.indexOf('_/') !== -1) path = path.replace('_/', '');
        dockerPullCmd += path;
        if (tagName) dockerPullCmd += ':' + tagName;
        return dockerPullCmd;
      };

      this.getDockerRegistryList = function() {
        return ContainerService.getDockerRegistryList()
          .then(
            function(result) {
              dockerRegistryMap = result;
            }
          );
      };

      this.returnDockerRegistryList = function() {
        return dockerRegistryMap;
      };
  }]);

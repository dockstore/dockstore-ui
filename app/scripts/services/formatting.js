'use strict';

/**
 * @ngdoc service
 * @name dockstore.ui.Formatting
 * @description
 * # Formatting
 * Service in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .service('FormattingService', [
    function () {
    
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
          default:
            return null;
        }
        gitWebUrl += matchRes[1] + '/' + matchRes[2];
        return gitWebUrl;
      };

      this.getImageReposProvider = function(path) {
        if (path.indexOf('quay.io') !== -1) {
          return 'QUAY_IO';
        } else if (path.indexOf('hub.docker.com') !== -1) {
          return 'DOCKER_HUB';
        } else {
          return null;
        }
      };

      this.getImageReposProviderName = function(imageReposProvider) {
        switch (imageReposProvider) {
          case 'QUAY_IO':
            return 'Quay.io';
          case 'DOCKER_HUB':
            return 'Docker Hub';
          default:
            return 'Unknown';
        }
      };

      this.getImageReposWebUrl = function(path, imageReposProvider) {
        if (!path) return null;
        var imageReposRegExp = /^(.*)\/(.*)\/(.*)\/?$/i;
        var matchRes = imageReposRegExp.exec(path);
        if (!matchRes) return null;
        var imageReposWebUrl = '';
        var suffix = '';
        switch (imageReposProvider) {
          case 'QUAY_IO':
            imageReposWebUrl = 'https://quay.io/repository/';
            break;
          case 'DOCKER_HUB':
            imageReposWebUrl = 'https://hub.docker.com/' +
                ((matchRes[2] !== '_') ? 'r/' : '');
            suffix = '/';
            break;
          default:
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

  }]);

'use strict';

/**
 * @ngdoc filter
 * @name dockstore.ui.filter:HiddenTagsFilter
 * @function
 * @description
 * # HiddenTagsFilter
 * Filter in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .filter('HiddenTagsFilter', [function () {
    return function (versionTags, editMode) {
      if (!versionTags) return [];
      var filteredVersionTags = [];
      for (var i = 0; i < versionTags.length; i++) {
        if (editMode || !versionTags[i].hidden) {
          filteredVersionTags.push(versionTags[i]);
        }
      }
      return filteredVersionTags;
    };
  }] );

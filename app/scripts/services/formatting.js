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
        var moy = ['Jan.', 'Feb.', 'Mar.', 'Apr.',
                    'May', 'Jun.', 'Jul.', 'Aug.',
                    'Sept.', 'Oct.', 'Nov.', 'Dec.'];
        var dateObj = new Date(timestamp);
        return moy[dateObj.getMonth()] + ' ' +
                dateObj.getDate() + ', ' +
                dateObj.getFullYear() + ' at ' +
                dateObj.toLocaleTimeString();
      };

  }]);

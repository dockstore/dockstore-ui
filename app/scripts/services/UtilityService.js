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
 * @name dockstore.ui.UtilityService
 * @description
 * # UtilityService
 * Service in the dockstore.ui.
 */
angular.module('dockstore.ui')
  .service('UtilityService', [
    function () {

      this.getTimeAgo = function(timestamp, timeConversion) {
        var timeDiff = (new Date()).getTime() - timestamp;
        return Math.floor(timeDiff / timeConversion);
      };

      this.getTimeAgoString = function(timestamp) {
        var msToDays = 1000 * 60 * 60 * 24;
        var msToHours = 1000 * 60 * 60;
        var msToMins = 1000 * 60;

        var timeAgo = this.getTimeAgo(timestamp, msToDays);
        if (timeAgo < 1){
          timeAgo = this.getTimeAgo(timestamp, msToHours);
          if (timeAgo < 1) {
            timeAgo = this.getTimeAgo(timestamp, msToMins);
            if (timeAgo === 0) {
              return '<1 minute ago';
            } else {
              return timeAgo.toString() +
                    ((timeAgo === 1) ? ' minute ago' : ' minutes ago');
            }
          } else {
            return timeAgo.toString() +
                  ((timeAgo === 1) ? ' hour ago' : ' hours ago');
          }
        } else {
          return timeAgo.toString() +
                ((timeAgo === 1) ? ' day ago' : ' days ago');
        }
      };

      this.getIconClass = function(columnName, sortColumn, sortReverse) {
        if (sortColumn === columnName) {
          return !sortReverse ?
            'glyphicon-sort-by-alphabet' : 'glyphicon-sort-by-alphabet-alt';
        } else {
          return 'glyphicon-sort';
        }
      };

      this.changePage = function(nextPage, currPage, getFirstPage, getLastPage) {
        if (nextPage) {
          /* Next Page*/
          if (currPage === getLastPage) return;
          return currPage++;
        } else {
          /* Previous Page*/
          if (currPage === getFirstPage) return;
          return currPage--;
        }
      };

      this.getListRange = function(numContsPage, currPage, filteredEntriesLength) {
        return {
          start: Math.min(numContsPage * (currPage - 1),
                          filteredEntriesLength),
          end: Math.min(numContsPage * currPage - 1,
                        filteredEntriesLength)
        };
      };

      this.getHumanReadableDescriptor = function(descriptor) {
        switch(descriptor) {
          case 'DOCKSTORE_CWL':
            return 'CWL';
          case 'DOCKSTORE_WDL' :
            return 'WDL';
          default :
            return 'n/a';
        }
      };

      this.getFirstPage = function() {
        return 1;
      };

      this.getLastPage = function(numContsPage, filteredEntriesLength) {
        return Math.ceil(filteredEntriesLength / numContsPage);
      };

      this.getMailToLink = function(entryType, entryPath, windlowLocation, email){
        var subject = encodeURIComponent("Question about the " + entryType + " " + entryPath + " on Dockstore");
        var body = encodeURIComponent("I would like to ask a question about the " + entryType + " at " + windlowLocation);
        return "mailto:" + email + "?subject=" + subject + "&body=" + body;
      };

      this.isVerifiedWorkflow = function(workflow) {
        if (workflow !== null) {
          for (var i = 0; i < workflow.workflowVersions.length; i++) {
            if (workflow.workflowVersions[i].verified) {
              return true;
            }
          }
          return false;
        }
      };

      this.isVerifiedTool = function(container) {
        if (container !== null) {
          for (var i = 0; i < container.tags.length; i++) {
            if (container.tags[i].verified) {
              return true;
            }
          }
          return false;
        }
      };

      this.getVerifiedWorkflowSources = function(workflow) {
        var sources = [];
        if (workflow !== null) {
          for (var i = 0; i < workflow.workflowVersions.length; i++) {
            if (workflow.workflowVersions[i].verified) {
              sources.push(workflow.workflowVersions[i].verifiedSource);
            }
          }
        }
        return sources.filter(function(elem, pos) {
          return sources.indexOf(elem) === pos;
        });
      };

      this.getVerifiedToolSources = function(container) {
        var sources = [];
        if (container !== null) {
          for (var i = 0; i < container.tags.length; i++) {
            if (container.tags[i].verified) {
              sources.push(container.tags[i].verifiedSource);
            }
          }
        }
        return sources.filter(function(elem, pos) {
          return sources.indexOf(elem) === pos;
        });
      };
  }]);

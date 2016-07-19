'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:WorkflowEditorCtrl
 * @description
 * # WorkflowEditorCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('WorkflowEditorCtrl', [
    '$scope',
    '$q',
    '$window',
    '$auth',
    '$timeout',
    'WorkflowService',
    'UserService',
    'TokenService',
    'NotificationService',
    function ($scope, $q, $window, $auth, $timeout,
        WorkflowService, UserService, TokenService, NtfnService) {

      $scope.userObj = UserService.getUserObj();
      $scope.activeTabs = [true];
      //there are 6 tabs, and only 1 tab can be active
      //so there are 5 tabs that are not active
      var notActiveTabs = 5;
      for (var i = 0; i < notActiveTabs; i++) $scope.activeTabs.push(false);

      $scope.listUserWorkflows = function(userId) {
        $scope.setWorkflowEditorError(null);
        return WorkflowService.getUserWorkflowList(userId)
          .then(
            function(workflows) {
              $scope.workflows = workflows;
              return workflows;
            },
            function(response) {
              $scope.setWorkflowEditorError(
                'The webservice encountered an error trying to load a list ' +
                'of workflows for this account.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.sortORGWorkflows = function(workflows, username) {
              var orgWorkflows = [];

              /* Group Workflows by Common Namespace */
              var getORGIndex = function(organization) {
                for (var i = 0; i < orgWorkflows.length; i++) {
                  if (orgWorkflows[i].organization === organization) return i;
                }
                return -1;
              };

              for (var i = 0; i < workflows.length; i++) {
                var pos = getORGIndex(workflows[i].organization);
                if (pos < 0) {
                  orgWorkflows.push({
                    organization: workflows[i].organization,
                    workflows: []
                  });
                  pos = orgWorkflows.length - 1;
                }
                orgWorkflows[pos].workflows.push(workflows[i]);
              }

              /* Sort Workflows in Each Namespace */
              for (var j = 0; j < orgWorkflows.length; j++) {
                orgWorkflows[j].workflows.sort(function(a, b) {
                  if (a.repository < b.repository) return -1;
                  if (a.repository > b.repository) return 1;
                  return 0;
                });
              }

              /* Return Namespaces w/ Nested Workflows */
              return (function(orgWorkflows, username) {
                var sortedorgWorkflows = [];
                /* User's Workflows Appear in First Section */
                var unIndex = -1; // username (user's personal workflows)
                var orIndex = -1; // 'Others' (i.e. no namespace)
                var orORGObj = null;
                for (var i = 0; i < orgWorkflows.length; i++) {
                  if (orgWorkflows[i].organization === username) {
                    unIndex = i;
                    sortedorgWorkflows.push(orgWorkflows[i]);
                  } else if (orgWorkflows[i].organization === '_') {
                    orIndex = i;
                    orORGObj = {
                      organization: 'Others',
                      workflows: orgWorkflows[i].workflows
                     };
                  }
                }
                if (unIndex >= 0) orgWorkflows.splice(unIndex, 1);
                if (orIndex >= 0) {
                  orgWorkflows.splice(
                  (unIndex < orIndex) ? orIndex - 1: orIndex,
                    1
                  );
                }
                sortedorgWorkflows = sortedorgWorkflows.concat(
                  orgWorkflows.sort(function(a, b) {
                    if (a.organization < b.organization) return -1;
                    if (a.organization > b.organization) return 1;
                    return 0;
                  })
                );
                if (orIndex >= 0) sortedorgWorkflows.push(orORGObj);

                return sortedorgWorkflows;
                })(orgWorkflows, username);
              };

      $scope.openOrganizationItem = function(organization) {
        for (var i = 0; i < $scope.orgWorkflows.length; i++) {
          if ($scope.orgWorkflows[i].organization === organization) {
            $scope.orgWorkflows[i].isOpen = true;
            break;
          }
        }
      };

      $scope.selectWorkflow = function(workflowId) {
        for (var i = 0; i < $scope.workflows.length; i++) {
          if ($scope.workflows[i].id === workflowId) {
            $scope.openOrganizationItem($scope.workflows[i].organization);
            $scope.selWorkflowObj = $scope.workflows[i];
            break;
          }
        }
      };

      $scope.setWorkflowEditorError = function(message, errorDetails) {
         if (message) {
           $scope.workflowEditorError = {
             message: message,
             errorDetails: errorDetails
           };
         } else {
           $scope.workflowEditorError = null;
         }
       };

      $scope.getCreateWorkflowObj = function(organization) {
        return {
          create: true,
          mode: 'STUB',
          name: '',
          workflowName: '',
          organization: organization ? organization : '',
          registry: '',
          gitUrl: '',
          default_workflow_path: '/Dockstore.cwl',
          is_published: false,
          scrProvider: 'GitHub',
          descriptorType: 'cwl'
        };
      };

    $scope.addWorkflow = function(workflowObj) {
        $scope.workflows.push(workflowObj);
        $scope.orgWorkflows = $scope.sortORGWorkflows(
          $scope.workflows,
          $scope.userObj.username
        );
        $scope.updateWorkflowTooltips();
        $scope.selectWorkflow(workflowObj.id);
        $scope.activeTabs[0] = true;
      };

      $scope.removeWorkflow = function(workflowId) {
        for (var i = 0; i < $scope.workflows.length; i++) {
          if ($scope.workflows[i].id === workflowId) {
            $scope.workflows.splice(i, 1);
            break;
          }
        }
        $scope.orgWorkflows = $scope.sortORGWorkflows(
          $scope.workflows,
          $scope.userObj.username
        );
        $scope.updateWorkflowTooltips();
        if ($scope.orgWorkflows.length > 0) {
          $scope.selectWorkflow($scope.orgWorkflows[0].workflows[0].id);
        }
        $scope.activeTabs[0] = true;
      };

      $scope.updateWorkflowTooltips = function() {
        $timeout(function() {
          $('div.ns-containers-accordion [data-toggle="tooltip"]').tooltip();
        }, 200);
      };

    $scope.refreshUserWorkflows = function(userId) {
        if ($scope.refreshingWorkflows) return;
        $scope.refreshingWorkflows = true;
        $scope.setWorkflowEditorError(null);
        return WorkflowService.refreshUserWorkflows(userId)
          .then(
            function(workflows) {
              $window.location.href = '/my-workflows';
              return workflows;
            },
            function(response) {
              $scope.setWorkflowEditorError(
                'The webservice encountered an error trying to refresh ' +
                'containers for User: ' + $scope.userObj.username + '. If the ' +
                'problem persists after 60 min. has passed, try re-linking ' +
                'your external accounts and repeating the action.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          ).finally(function(response) {
            $scope.refreshingWorkflows = false;
          });
      };

    $scope.updateORGWorkflowsPublished = function(workflowObj) {
        for (var i = 0; i < $scope.orgWorkflows.length; i++) {
          for (var j = 0; j < $scope.orgWorkflows[i].workflows.length; j++) {
            if ($scope.orgWorkflows[i].workflows[j].id === workflowObj.id) {
              $scope.orgWorkflows[i].workflows[j].is_published = workflowObj.is_published;
              return;
            }
          }
        }
      };

    $scope.updateWorkflowObj = function(workflowObj, activeTabIndex) {
        if (workflowObj) {
          $scope.replaceWorkflow(workflowObj, activeTabIndex);
        } else {
          /* 'Real-time' */
          $scope.updateORGWorkflowsPublished($scope.selWorkflowObj);
        }
      };

    $scope.replaceWorkflow = function(workflowObj, activeTabIndex) {
        for (var i = 0; i < $scope.workflows.length; i++) {
          if ($scope.workflows[i].id === workflowObj.id) break;
        }
        $scope.workflows[i] = workflowObj;
        $scope.orgWorkflows = $scope.sortORGWorkflows(
          $scope.workflows,
          $scope.userObj.username
        );
        $scope.updateWorkflowTooltips();
        $scope.selectWorkflow(workflowObj.id);
        $scope.activeTabs[activeTabIndex ? activeTabIndex : 0] = true;
      };

      $scope.listUserWorkflows($scope.userObj.id).then(
        function(workflows) {
          $scope.orgWorkflows = $scope.sortORGWorkflows(workflows, $scope.userObj.username);
          if ($scope.orgWorkflows.length > 0) {
            $scope.selectWorkflow($scope.orgWorkflows[0].workflows[0].id);
          }

          $scope.updateWorkflowTooltips();
        });

  }]);

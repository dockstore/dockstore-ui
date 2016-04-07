'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('SearchWorkflowCtrl', [
    '$scope',
    '$rootScope',
    '$q',
    '$window',
    '$location',
    '$auth',
    '$routeParams',
    'WorkflowService',
    'UserService',
    'TokenService',
    'NotificationService',
    function ($scope, $rootScope, $q, $window, $location, $auth, $routeParams,
        WorkflowService, UserService, TokenService, NtfnService) {

      $scope.userObj = UserService.getUserObj();

      $scope.listPublishedWorkflows = function() {
        return WorkflowService.getPublishedWorkflowList()
          .then(
            function(workflows) {
              $scope.workflows = workflows;
            },
            function(response) {
              var message = '[HTTP ' + response.status + '] ' +
                  response.statusText + ': ' + response.data;
              NtfnService.popError('List Published Workflows', message);
              return $q.reject(response);
            }
          );
      };

      if ($auth.isAuthenticated()) {
        TokenService.getUserTokenStatusSet($scope.userObj.id)
          .then(
            function(tokenStatusSet) {
              $scope.tokenStatusSet = tokenStatusSet;
              if (!tokenStatusSet.github) {
                $window.location.href = '/onboarding';
              }
            }
          );
      }

      if ($routeParams.searchQueryWorkflow) {
        $rootScope.searchQueryWorkflow = $routeParams.searchQueryWorkflow;
      }

      $scope.listPublishedWorkflows();

  }]);

'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:FootnoteCtrl
 * @description
 * # FootnoteCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('FootnoteCtrl', [
    '$scope',
    '$q',
    'TokenService',
    function ($scope, $q, TokenService) {

      $scope.metadata = function(){
        return TokenService.getWebServiceVersion()
          .then(
            function(resultFromApi) {
              $scope.apiVersion = resultFromApi.version;
              $scope.ga4ghApiVersion = resultFromApi.apiVersion;
            },
            function(response) {
              $scope.apiVersion = "unreachable";
              $scope.ga4ghApiVersion = "unreachable";
              var message = '[HTTP ' + response.status + '] ' +
                response.statusText + ': ' + response.data;
              TokenService.popError('Metadata', message);
              return $q.reject(response);
            }
          );
      };

      $scope.metadata();

  }]);

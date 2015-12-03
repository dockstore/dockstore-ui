'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:RegisterContainerCtrl
 * @description
 * # RegisterContainerCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('RegisterContainerCtrl', [
    '$scope',
    function ($scope) {
    
      $scope.setAutoToolName = function(imageUrl) {console.log(imageUrl);
        var matchObj = imageUrl.match(/^(.+\/)*([\w-]+)$/i);
        var imageName = '';
        if (matchObj && matchObj.length > 2) imageName = matchObj[2];
        if (!$scope.newContainerObj.toolName) {
          $scope.newContainerObj.toolName = imageName;
        }
      };

  }]);

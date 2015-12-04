'use strict';

/**
 * @ngdoc directive
 * @name dockstore.ui.directive:registerContainer
 * @description
 * # registerContainer
 */
angular.module('dockstore.ui')
  .directive('registerContainer', function () {
    return {
      restrict: 'AE',
      controller: 'RegisterContainerCtrl',
      scope: {
        containerObj: '=',
        addContainer: '&'
      },
      templateUrl: 'templates/registercontainer.html',
      link: function postLink(scope, element, attrs) {
        scope.$watch('containerObj', function(newValue, oldValue, scope) {
          if (newValue) {
            $(element).find('input[name="srcCodeRepository"]').val(
              scope.containerObj.namespace ?
                'https://github.com/' + scope.containerObj.namespace + '/' : ''
            );
            $(element).find('input[name="imageUrl"]').val(
              scope.containerObj.namespace ?
                  scope.containerObj.namespace + '/' : ''
            );
          }
        });
        scope.$watch('toggleModal', function(newValue, oldValue) {
          if (scope.toggleModal) {
            $('#registerContainerModal').modal('toggle');
            scope.toggleModal = false;
          }
        });
        scope.$watch('containerObj.imageUrl', function(newValue, oldValue) {
          if (newValue) {
            var imageName = scope.getImageName(newValue, 'name');
            if (imageName) scope.containerObj.toolname = imageName;
          }
        });
      }
    };
  });

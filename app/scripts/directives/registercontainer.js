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
        $('#registerContainerModal').on('hidden.bs.modal', function(event) {
          scope.closeRegisterContainerModal(false);
        });
        scope.$watch('containerObj', function(newValue, oldValue, scope) {
          if (newValue) {
            scope.containerObj.gitUrl = scope.containerObj.namespace ?
              'https://github.com/' + scope.containerObj.namespace + '/' : '';
            scope.containerObj.imageUrl = scope.containerObj.namespace ?
              'https://quay.io/repository/' + scope.containerObj.namespace + '/' : '';
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

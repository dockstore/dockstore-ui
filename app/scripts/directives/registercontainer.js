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
        /* Watch for changes to the container being edited */
        $('#registerContainerModal').on('hidden.bs.modal', function(event) {
          scope.closeRegisterContainerModal(false);
        });
        scope.$watch('containerObj', function(newValue, oldValue, scope) {
          if (newValue) {
            scope.containerObj.gitPath = scope.containerObj.namespace ?
              scope.containerObj.namespace + '/' + 'new_container' : '';
            scope.containerObj.imagePath = scope.containerObj.namespace ?
              scope.containerObj.namespace + '/' + 'new_container' : '';
            $(element).find('[data-toggle="tooltip"]').tooltip();
          }
        });
        scope.$watch('toggleModal', function(newValue, oldValue) {
          if (scope.toggleModal) {
            $('#registerContainerModal').modal('toggle');
            scope.toggleModal = false;
          }
        });
        scope.$watch('containerObj.gitPath', function(newValue, oldValue) {
          if (newValue) {
            scope.containerObj.imagePath = newValue;
          }
        });
        scope.$watch('containerObj.imagePath', function(newValue, oldValue) {
          if (newValue) {
            var imageName = scope.getImagePath(newValue, 'name');
            if (imageName) scope.containerObj.toolname = imageName;
          }
        });
      }
    };
  });

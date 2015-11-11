'use strict';

describe('Controller: ContainerDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('dockstore.ui'));

  var ContainerDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContainerDetailsCtrl = $controller('ContainerDetailsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(ContainerDetailsCtrl.awesomeThings.length).toBe(3);
  // });
});

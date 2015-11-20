'use strict';

describe('Controller: ContainerEditorCtrl', function () {

  // load the controller's module
  beforeEach(module('dockstore.ui'));

  var ContainerEditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContainerEditorCtrl = $controller('ContainerEditorCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(ContainerEditorCtrl.awesomeThings.length).toBe(3);
  // });
});

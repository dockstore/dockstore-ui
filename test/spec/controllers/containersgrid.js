'use strict';

describe('Controller: ContainersGridCtrl', function () {

  // load the controller's module
  beforeEach(module('dockstore.ui'));

  var ContainersGridCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContainersGridCtrl = $controller('ContainersGridCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(ContainersGridCtrl.awesomeThings.length).toBe(3);
  // });
});

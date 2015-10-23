'use strict';

describe('Controller: ContainersCtrl', function () {

  // load the controller's module
  beforeEach(module('dockstore.ui'));

  var ContainersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContainersCtrl = $controller('ContainersCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(ContainersCtrl.awesomeThings.length).toBe(3);
  // });
});

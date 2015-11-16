'use strict';

describe('Controller: RegisterContainerCtrl', function () {

  // load the controller's module
  beforeEach(module('dockstore.ui'));

  var RegisterContainerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegisterContainerCtrl = $controller('RegisterContainerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(RegisterContainerCtrl.awesomeThings.length).toBe(3);
  // });
});

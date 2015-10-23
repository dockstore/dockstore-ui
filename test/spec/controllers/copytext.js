'use strict';

describe('Controller: CopyTextCtrl', function () {

  // load the controller's module
  beforeEach(module('dockstore.ui'));

  var CopyTextCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CopyTextCtrl = $controller('CopyTextCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(CopyTextCtrl.awesomeThings.length).toBe(3);
  // });
});

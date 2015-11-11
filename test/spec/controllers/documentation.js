'use strict';

describe('Controller: DocumentationCtrl', function () {

  // load the controller's module
  beforeEach(module('dockstore.ui'));

  var DocumentationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DocumentationCtrl = $controller('DocumentationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(DocumentationCtrl.awesomeThings.length).toBe(3);
  // });
});

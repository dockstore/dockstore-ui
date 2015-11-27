'use strict';

describe('Controller: tagEditorCtrl', function () {

  // load the controller's module
  beforeEach(module('dockstore.ui'));

  var tagEditorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    tagEditorCtrl = $controller('tagEditorCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(tagEditorCtrl.awesomeThings.length).toBe(3);
  // });
});

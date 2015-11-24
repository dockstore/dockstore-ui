'use strict';

describe('Controller: ContainerFileViewerCtrl', function () {

  // load the controller's module
  beforeEach(module('dockstore.ui'));

  var ContainerFileViewerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContainerFileViewerCtrl = $controller('ContainerFileViewerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(ContainerFileViewerCtrl.awesomeThings.length).toBe(3);
  // });
});

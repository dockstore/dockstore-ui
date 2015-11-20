'use strict';

describe('Controller: ContainerViewerCtrl', function () {

  // load the controller's module
  beforeEach(module('dockstore.ui'));

  var ContainerViewerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContainerViewerCtrl = $controller('ContainerViewerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(ContainerViewerCtrl.awesomeThings.length).toBe(3);
  // });
});

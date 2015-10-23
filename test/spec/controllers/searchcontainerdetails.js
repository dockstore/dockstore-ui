'use strict';

describe('Controller: SearchContainerDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('dockstore.ui'));

  var SearchContainerDetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SearchContainerDetailsCtrl = $controller('SearchContainerDetailsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(SearchContainerDetailsCtrl.awesomeThings.length).toBe(3);
  // });
});

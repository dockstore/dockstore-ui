'use strict';

describe('Controller: TokensGridCtrl', function () {

  // load the controller's module
  beforeEach(module('dockstore.ui'));

  var TokensGridCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TokensGridCtrl = $controller('TokensGridCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(TokensGridCtrl.awesomeThings.length).toBe(3);
  // });
});

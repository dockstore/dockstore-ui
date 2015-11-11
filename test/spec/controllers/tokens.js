'use strict';

describe('Controller: TokensCtrl', function () {

  // load the controller's module
  beforeEach(module('dockstore.ui'));

  var TokensCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TokensCtrl = $controller('TokensCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(TokensCtrl.awesomeThings.length).toBe(3);
  // });
});

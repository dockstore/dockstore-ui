'use strict';

describe('Directive: Navbar', function () {

  // load the directive's module
  beforeEach(module('dockstore.ui'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  // it('should make hidden element visible', inject(function ($compile) {
  //   element = angular.element('<-navbar></-navbar>');
  //   element = $compile(element)(scope);
  //   expect(element.text()).toBe('this is the Navbar directive');
  // }));
});

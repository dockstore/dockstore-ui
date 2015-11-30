'use strict';

describe('Directive: tagEditor', function () {

  // load the directive's module
  beforeEach(module('dockstore.ui'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  // it('should make hidden element visible', inject(function ($compile) {
  //   element = angular.element('<tag-editor></tag-editor>');
  //   element = $compile(element)(scope);
  //   expect(element.text()).toBe('this is the tagEditor directive');
  // }));
});

'use strict';

describe('Filter: PreviewFilter', function () {

  // load the filter's module
  beforeEach(module('dockstore.ui'));

  // initialize a new instance of the filter before each test
  var PreviewFilter;
  beforeEach(inject(function ($filter) {
    PreviewFilter = $filter('PreviewFilter');
  }));

  // it('should return the input prefixed with "PreviewFilter filter:"', function () {
  //   var text = 'angularjs';
  //   expect(PreviewFilter(text)).toBe('PreviewFilter filter: ' + text);
  // });

});

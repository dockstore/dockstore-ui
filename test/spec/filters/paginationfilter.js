'use strict';

describe('Filter: PaginationFilter', function () {

  // load the filter's module
  beforeEach(module('dockstore.ui'));

  // initialize a new instance of the filter before each test
  var PaginationFilter;
  beforeEach(inject(function ($filter) {
    PaginationFilter = $filter('PaginationFilter');
  }));

  // it('should return the input prefixed with "PaginationFilter filter:"', function () {
  //   var text = 'angularjs';
  //   //expect(PaginationFilter(text)).toBe('PaginationFilter filter: ' + text);
  //   expect(new PaginationFilter(text)).toBe('PaginationFilter filter: ' + text);
  // });

});

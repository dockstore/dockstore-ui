'use strict';

describe('Filter: HiddenTagsFilter', function () {

  // load the filter's module
  beforeEach(module('dockstore.ui'));

  // initialize a new instance of the filter before each test
  var HiddenTagsFilter;
  beforeEach(inject(function ($filter) {
    HiddenTagsFilter = $filter('HiddenTagsFilter');
  }));

  // it('should return the input prefixed with "HiddenTagsFilter filter:"', function () {
  //   var text = 'angularjs';
  //   expect(HiddenTagsFilter(text)).toBe('HiddenTagsFilter filter: ' + text);
  // });

});

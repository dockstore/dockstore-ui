'use strict';

describe('Service: TokenService', function () {

  // load the service's module
  beforeEach(module('dockstore.ui'));

  // instantiate service
  var TokenService;
  beforeEach(inject(function (_TokenService_) {
    TokenService = _TokenService_;
  }));

  it('should do something', function () {
    expect(!!TokenService).toBe(true);
  });

});

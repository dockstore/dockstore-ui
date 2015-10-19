'use strict';

describe('Service: WebService', function () {

  // load the service's module
  beforeEach(module('dockstore.ui'));

  // instantiate service
  var WebService;
  beforeEach(inject(function (_WebService_) {
    WebService = _WebService_;
  }));

  it('should do something', function () {
    expect(!!WebService).toBe(true);
  });

});

'use strict';

describe('Service: ContainerService', function () {

  // load the service's module
  beforeEach(module('dockstore.ui'));

  // instantiate service
  var ContainerService;
  beforeEach(inject(function (_ContainerService_) {
    ContainerService = _ContainerService_;
  }));

  it('should do something', function () {
    expect(!!ContainerService).toBe(true);
  });

});

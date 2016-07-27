'use strict';

describe('Controller: RegisterWorkflowCtrl', function () {

  // load the controller's module
  beforeEach(module('dockstore.ui'));

  var RegisterWorkflowCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegisterWorkflowCtrl = $controller('RegisterWorkflowCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should change the extension', function(){
    expect(scope.changeExt('/foo.cwl','wdl')).toBe('/foo.wdl');
  });

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(RegisterWorkflowCtrl.awesomeThings.length).toBe(3);
  // });
});
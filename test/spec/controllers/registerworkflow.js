/*
 *    Copyright 2016 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

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
    expect(scope.changeExt('/Dockstore.cwl','wdl')).toBe('/Dockstore.wdl');
  });

  describe('test setWorkflowEditError', function(){
    it('should set error message and errordetails', function(){
      scope.setWorkflowEditError("errorMessage","errorDetails");
      expect(scope.workflowEditError.message).toBe("errorMessage");
      expect(scope.workflowEditError.errorDetails).toBe("errorDetails");
    });

    it('should return null', function() {
      scope.setWorkflowEditError("","");
      expect(scope.workflowEditError).toBeNull();
    });
  });

  it('should get workflow path', function(){
    expect(scope.getWorkflowPath('/Dockstore.cwl','')).toBe('Dockstore.cwl');
  });

});

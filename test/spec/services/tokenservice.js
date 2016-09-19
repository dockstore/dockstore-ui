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

describe('Service: TokenService', function () {

  // load the service's module
  beforeEach(module('dockstore.ui'));

  // instantiate service
  var TokenService, httpBackend;

  beforeEach(inject(function (_TokenService_, $httpBackend) {
    TokenService = _TokenService_;
    httpBackend = $httpBackend;
  }));

  describe('mocking services: GET', function() {
    // test taken from https://github.com/DockstoreTestUser/hello-dockstore-workflow/tree/testBoth

    it('should mock metadata', function(){
      // mock metadata
      httpBackend.whenGET("http://localhost:8080/api/ga4gh/v1/metadata").respond({
        "version": "0.4-beta.5",
        "api-version": "1.0.0",
        "country": "CAN",
        "friendly-name": "Dockstore"
      });

      TokenService.getWebServiceVersion()
        .then(function(response){
          expect(response.version).toBe("0.4-beta.5");
        });
      httpBackend.flush();
    });
  });

});

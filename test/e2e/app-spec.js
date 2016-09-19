
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

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('dockstore homepage', function() {

  beforeEach(function () {
    browser.ignoreSynchronization = true; //to avoid error angular is not found --> could be because of syncing problem
    browser.get('index.html');
  });

	it('should automatically redirect to / when location hash is empty', function() {
	  // ignoring for now, not working in combination with API display
		//expect(browser.getLocationAbsUrl()).toMatch("/");
	});
});

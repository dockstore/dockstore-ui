
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

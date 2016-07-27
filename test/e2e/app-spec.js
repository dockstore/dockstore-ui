
'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('my app', function() {

	beforeEach(function () {
		browser.get('index.html');
	});
	
	it('should automatically redirect to / when location hash is empty', function() {
		expect(browser.getLocationAbsUrl()).toMatch("/");
	}); 
});
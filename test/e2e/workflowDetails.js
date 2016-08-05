
'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

var page = function(){
  this.button = element(by.id("editButton"));
};

describe('Dockstore Workflow Details', function() {
  var Page = new page();

	beforeEach(function () {
    browser.ignoreSynchronization = true; //to avoid error angular is not found --> could be because of syncing problem
		browser.get('workflows/DockstoreTestUser/hello-dockstore-workflow');
  });

	it('should not have Edit button', function() {
    // edit button should only appear inside "My Workflows"
    // unless logged in as the author, edit button should not be present in "Workflows"
    expect(Page.button.isPresent()).toBe(false);
  });
});

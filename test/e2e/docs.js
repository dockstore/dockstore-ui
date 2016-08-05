
'use strict';

describe('documents', function() {

  beforeEach(function () {
    browser.ignoreSynchronization = true; //to avoid error angular is not found --> could be because of syncing problem
    browser.get("docs");
  });
});

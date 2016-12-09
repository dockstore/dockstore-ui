
describe('Dockstore tool search page', function() {
  require('./helper.js')
	beforeEach(function () {
     cy.visit(String(global.baseUrl) + "/search-containers")
  });

  describe('Select a tool', function() {
    it('Should have two tools (and a hidden row)', function() {
      cy
        .get('tbody')
        .children('tr')
        .should('have.length', 3)
    });

    it('Select dockstore-tool-imports', function() {
      cy
        .get('tbody')
        .children('tr')
        .first()
        .find('a')
        .first()
        .click()
        .get('#tool-path')
        .should('contain', 'quay.io/dockstoretestuser2/dockstore-tool-imports ')
    });
  });
})

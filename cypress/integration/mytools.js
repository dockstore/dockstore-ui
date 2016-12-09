describe('Dockstore my tools', function() {
  require('./helper.js')

	beforeEach(function () {
     cy.visit(String(global.baseUrl) + "/my-containers")
  });

  describe('publish a tool', function() {
    it('Invalid tool should not be publishable', function() {
      cy
        .get('#publishButton')
        .should('be.disabled')
    });

    it("publish and unpublish", function() {
      cy
        .get('.panel-group')
          .children(':nth-child(2)')
          .click()
          .children(':nth-child(2)')
          .find('a')
          .first()
          .click()
          .get('#publishButton')
          .should('contain', 'Unpublish')
          .click()
          .should('contain', 'Publish')
          .click()
          .should('contain', 'Unpublish')

    });
  });
});

describe('Dropdown test', function() {
  require('./helper.js')

	beforeEach(function () {
    cy.visit(String(global.baseUrl))

     // Select dropdown
     cy
        .get('#dropdown-main')
        .click()
  });

    describe('Go to accounts page', function() {
      beforeEach(function() {
        // Select dropdown accounts
        cy
          .get('#dropdown-accounts')
          .click()
      });

      it('Should show all accounts as linked (except GitLab)', function(){
        cy
          .get('#github-linked')
          .should('be.visible')
        cy
          .get('#github-not-linked')
          .should('not.be.visible')
        cy
          .get('#bitbucket-linked')
          .should('not.be.visible')
        cy
          .get('#bitbucket-not-linked')
          .should('be.visible')
        cy
          .get('#gitlab-linked')
          .should('not.be.visible')
        cy
          .get('#gitlab-not-linked')
          .should('be.visible')
        cy
          .get('#quay-linked')
          .should('be.visible')
        cy
          .get('#quay-not-linked')
          .should('not.be.visible')
      });
    });

    describe('Go to tokens page', function() {
      beforeEach(function() {
        // Select dropdown tokens
        cy
          .get('#dropdown-tokens')
          .click()
      });

      it('Should have three tokens', function(){
        expect(('#dockstore_token')).to.exist;
        expect(('#github.com_token')).to.exist;
        expect(('#quay.io_token')).to.exist;
      });
    });

    describe('Go to setup page', function() {
      beforeEach(function() {
        // Select dropdown setup
        cy
          .get('#dropdown-onboarding')
          .click()
      });

      it('Should show GitHub and Quay.io linked', function(){
        cy
          .get('#github-linked')
          .should('be.visible')
        cy
          .get('#github-not-linked')
          .should('not.be.visible')
        cy
          .get('#bitbucket-linked')
          .should('not.be.visible')
        cy
          .get('#bitbucket-not-linked')
          .should('be.visible')
        cy
          .get('#gitlab-linked')
          .should('not.be.visible')
        cy
          .get('#gitlab-not-linked')
          .should('be.visible')
        cy
          .get('#quay-linked')
          .should('be.visible')
        cy
          .get('#quay-not-linked')
          .should('not.be.visible')
      });

      it('Go through steps', function(){
        // Should start on step 1
        cy
          .get('#step_one')
          .should('be.visible')
        cy
          .get('#step_two')
          .should('not.be.visible')
        cy
          .get('#step_three')
          .should('not.be.visible')
        cy
          .get('#next_step')
          .click()

        // Should now be on step 2
        cy
          .get('#step_one')
          .should('not.be.visible')
        cy
          .get('#step_two')
          .should('be.visible')
        cy
          .get('#step_three')
          .should('not.be.visible')
        cy
          .get('#next_step')
          .click()

        // Should now be on step 3
        cy
          .get('#step_one')
          .should('not.be.visible')
        cy
          .get('#step_two')
          .should('not.be.visible')
        cy
          .get('#step_three')
          .should('be.visible')
        cy
          .get('#finish_step')
          .click()
      });
    });
});

describe ('Test App', () => {

  it ('launches', () => {
    cy.visit ('/');
  });

  it ('assignment buttons appear', () => {
    cy.visit('/');
    cy.get('[data-cy=assignmentButton]').should('be.visible');
    cy.get('[data-cy=assignmentButton]').should('contain', 'Assignment 1');
  });

  it('shows Winter courses when Winter is selected', () => {
    cy.visit ('/');
    cy.get('[data-cy=assignmentButton]').first().click();
    cy.get('[data-cy=modal]').should('be.visible');
  });
});
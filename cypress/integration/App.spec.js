describe ('Test App', () => {

  it ('launches', () => {
    cy.visit ('/');
  });

  it ('assignment buttons appear', () => {
    cy.visit('/');
    cy.get('[data-cy="assignmentButton"]').should('be.visible');
    cy.get('[data-cy="assignmentButton"]').should('contain', 'Algorithms');
  });
});
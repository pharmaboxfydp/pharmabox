/// <reference types="cypress" />

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('Sould load the login page', () => {
    cy.get('button').contains('Sign In').should('exist')
    cy.get('button').contains('Sign Up').should('exist')
  })
  it('Should allow a staff member to sign in', () => {
    cy.login(
      Cypress.env('test_staff_username_1'),
      Cypress.env('test_staff_password_1')
    )
    // check that we are on the /home page by default
    cy.get('span').contains('text', 'Home').should('exist')
    cy.get('span')
      .contains('text', 'Prescriptions Awaiting Pickup')
      .should('exist')
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal('/home')
    })
    cy.screenshot('Login with Staff')
  })
})

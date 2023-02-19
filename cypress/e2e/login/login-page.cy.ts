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
    const signInButton = cy.get('button').contains('Sign In')
    signInButton.click()
    cy.get('.cl-card').should('exist').should('have.class', 'cl-signIn-start')
  })
})

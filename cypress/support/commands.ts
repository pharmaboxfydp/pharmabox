/// <reference types="cypress" />
// ***********************************************
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (username: string, password: string) => {
  const signInButton = cy.get('button').contains('Sign In')
  signInButton.click()
  cy.get('.cl-card').should('exist').should('have.class', 'cl-signIn-start')
  const userNameField = cy.get('#identifier-field')
  userNameField.type(username)
  userNameField.should('have.value', username)
  cy.get('.cl-formButtonPrimary').click()
  cy.get('.cl-headerTitle').should('have.text', 'Enter your password')
  const passwordField = cy.get('#password-field')
  passwordField.type(password)
  cy.get('.cl-formButtonPrimary').click()
})

/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --

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
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

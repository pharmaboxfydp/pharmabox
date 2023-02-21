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
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal('/home')
    })
    // check that we can see the user info
    cy.get('div').contains('Test1').should('exist')
    cy.wait(1000)
  })
  it('Should allow a staff member to sign out', () => {
    cy.login(
      Cypress.env('test_staff_username_1'),
      Cypress.env('test_staff_password_1')
    )
    const logoutButton = cy.get('div').contains('Logout')
    logoutButton.should('exist')
    logoutButton.click()
    // user should be back on login page
    cy.get('button').contains('Sign In').should('exist')
    cy.get('button').contains('Sign Up').should('exist')
  })
  it('Should allow a pharmacist member to sign in', () => {
    cy.login(
      Cypress.env('test_pharmacist_username_1'),
      Cypress.env('test_pharmacist_password_1')
    )
    // check that we are on the /home page by default
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal('/home')
    })
    // check that we can see the user info
    cy.get('div').contains('Hussein').should('exist')
    cy.wait(1000)
  })
  it('Should allow a pharmacist member to sign out', () => {
    cy.login(
      Cypress.env('test_pharmacist_username_1'),
      Cypress.env('test_pharmacist_password_1')
    )
    const logoutButton = cy.get('div').contains('Logout')
    logoutButton.should('exist')
    logoutButton.click()
    // user should be back on login page
    cy.get('button').contains('Sign In').should('exist')
    cy.get('button').contains('Sign Up').should('exist')
  })
  it('Should take user to the documentation page from the login page', () => {
    const link = cy.get('a').contains('these people')
    link.should('have.attr', 'href', 'https://github.com/pharma-box')
  })
})

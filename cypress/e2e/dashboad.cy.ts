/// <reference types="cypress" />

function checkCorrectElementsRendered() {
  cy.get('span').contains('Home').should('exist')
  cy.get('span').contains('Prescriptions Awaiting Pickup').should('exist')
  cy.get('span').contains('Locker Status:').should('exist')
  cy.get('span').contains('Locker Number:').should('exist')
  cy.get('[data-cy="locker-box-status"]').should('have.length', 8)
}

function loginStaff() {
  cy.login(
    Cypress.env('test_staff_username_1'),
    Cypress.env('test_staff_password_1')
  )
}

describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('Should render the correct dashboard elements for an un-authorized staff member', () => {
    loginStaff()
    checkCorrectElementsRendered()
  })
  it('Should show a disabled state for an un-authorized staff member', () => {
    loginStaff()
    cy.get('[data-cy="create-prescription-button"]')
      .should('exist')
      .should('have.attr', 'disabled')
    cy.get('[data-cy="supervising-pharmacist"]').should('not.exist')
  })
})

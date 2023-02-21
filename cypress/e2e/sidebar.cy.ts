/// <reference types="cypress" />

describe('Sidebar Interface', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('Should show the correct navbar elements for a staff and pharmacist members', () => {
    /**
     * login staff member
     */
    cy.login(
      Cypress.env('test_staff_username_1'),
      Cypress.env('test_staff_password_1')
    )
    /**
     * Check that dashboard page exists
     */
    cy.get('[data-cy="Dashboard"]')
      .should('have.attr', 'href', '/home')
      .should('exist')

    /**
     * Check that patients page exists
     */
    cy.get('[data-cy="Patients"]')
      .should('have.attr', 'href', '/patients')
      .should('exist')

    /**
     * Check that workflows page exists
     */
    cy.get('[data-cy="Workflows"]')
      .should('have.attr', 'href', '/workflows')
      .should('exist')

    /**
     * Check that team page exists
     */
    cy.get('[data-cy="Team"]')
      .should('have.attr', 'href', '/team')
      .should('exist')

    /**
     * Check that the logbook page exists
     */
    cy.get('[data-cy="Logbook"]')
      .should('have.attr', 'href', '/logbook')
      .should('exist')

    /**
     * Check that the settings page exists
     */
    cy.get('[data-cy="Settings"]')
      .should('have.attr', 'href', '/settings')
      .should('exist')

    /**
     * Check that the logout button exists
     */
    cy.get('[data-cy="Logout"]')
      .should('have.attr', 'href', '/')
      .should('exist')

    /**
     * Should show pharmabox logo
     */
    cy.get('[alt="Pharmabox"]').should('exist')
  })
})

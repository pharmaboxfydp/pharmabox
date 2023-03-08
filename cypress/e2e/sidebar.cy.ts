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

    /**
     * Should show the correct users first name at the top
     */
    cy.get('div').contains('Test1').should('exist')

    /**
     * Should show the avatar for the user
     */
    cy.get('[role="presentation"]').should('exist')
  })

  it('Should take the user to the Correct Pages', () => {
    cy.login(
      Cypress.env('test_staff_username_1'),
      Cypress.env('test_staff_password_1')
    )
    /**
     * Check that dashboard page exists
     */
    cy.get('[data-cy="Dashboard"]').click()
    cy.location({ timeout: 1000 }).should((loc) => {
      expect(loc.pathname).to.equal('/home')
    })
    cy.get('span').contains('Home').should('exist')

    /**
     * Check that patients page exists
     */
    cy.get('[data-cy="Patients"]').click()
    cy.wait(1000)
    cy.location({ timeout: 1000 }).should((loc) => {
      expect(loc.pathname).to.equal('/patients')
    })
    cy.get('span').contains('Patients').should('exist')

    /**
     * Check that workflows page exists
     */
    // cy.get('[data-cy="Workflows"]').click()
    // cy.wait(1000)
    // cy.location({ timeout: 1000 }).should((loc) => {
    //   expect(loc.pathname).to.equal('/workflows')
    // })
    // cy.get('span').contains('Workflows').should('exist')

    /**
     * Check that team page exists
     */
    cy.get('[data-cy="Team"]').click()
    cy.wait(1000)
    cy.location({ timeout: 1000 }).should((loc) => {
      expect(loc.pathname).to.equal('/team')
    })
    cy.get('span').contains('Team').should('exist')

    /**
     * Check that the logbook page exists
     */
    // cy.get('[data-cy="Logbook"]').click()
    // cy.wait(1000)
    // cy.location({ timeout: 1000 }).should((loc) => {
    //   expect(loc.pathname).to.equal('/logbook')
    // })
    // cy.get('span').contains('Logbook').should('exist')
    /**
     * Check that the settings page exists
     */
    cy.get('[data-cy="Settings"]').click()
    cy.wait(1000)
    cy.location({ timeout: 1000 }).should((loc) => {
      expect(loc.pathname).to.equal('/settings')
    })
    cy.get('span').contains('Settings').should('exist')

    /**
     * Should take users to the settings/profile page
     */
    cy.get('[data-cy="nav-user-icon"]').click()
    cy.wait(1000)
    cy.location({ timeout: 1000 }).should((loc) => {
      expect(loc.pathname).to.equal('/settings/profile')
    })
    cy.get('span').contains('Profile').should('exist')
  })
})

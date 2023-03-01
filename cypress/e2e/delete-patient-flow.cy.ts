/// <reference types="cypress" />

function loginStaffDeletePatient() {
  cy.login(
    Cypress.env('test_staff_username_2'),
    Cypress.env('test_staff_password_2')
  )
}

describe('Edit an existing patient', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(1000)
  })
  it('Should allow a user to delete a patient from the patient profile page', () => {
    // login as a pharmacist
    loginStaffDeletePatient()

    // wait to login
    cy.wait(1000)

    // go to patients page
    cy.get('[data-cy="Patients"]').click()

    // wait for patients page to load
    cy.wait(2000)

    // click the Auer
    cy.get('tbody').find('tr').contains('Auer').click()

    // click the dots menu
    cy.get('[data-cy="dots-menu"]').click()

    // click the delete patient
    cy.get('button').contains('Delete Patient').click()

    // wait for modal to load
    cy.wait(1000)

    // should show modal
    cy.get('span').contains('Delete Patient').should('exist')
    cy.get('span')
      .contains(
        'Delete Rebekah Auer from PharmaBox? This action cannot be undone.'
      )
      .should('exist')

    // delete patient
    cy.get('button').contains('Remove Rebekah Auer').click()

    // wait while going back to patients page
    cy.wait(1000)

    cy.location().should((loc) => {
      expect(loc.pathname).to.equal('/patients')
    })

    cy.get('tbody').find('tr').contains('Auer').should('not.exist')
  })
})

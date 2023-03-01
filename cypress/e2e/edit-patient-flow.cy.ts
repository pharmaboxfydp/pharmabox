/// <reference types="cypress" />

function loginStaffEditPatient() {
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
  it('Should bring a user to the patient profile page', () => {
    // login as a pharmacist
    loginStaffEditPatient()

    // wait to login
    cy.wait(1000)

    // go to patients page
    cy.get('[data-cy="Patients"]').click()

    // wait for patients page to load
    cy.wait(2000)

    const userFirstName = 'Mathilde'
    const userLastName = 'Armstrong'
    // search for user
    cy.get('[data-cy="search-first-name"]').type(userFirstName)

    cy.wait(2000)

    cy.get('tbody').find('tr').click()

    // we should be on the patients specific page
    cy.wait(1000)
    cy.get('span').contains(`${userFirstName} ${userLastName}`).should('exist')
  })

  //   it('Should allow an authorized user to create a patient', () => {
  //     // login as a pharmacist
  //     loginStaffEditPatient()
  //   })
})

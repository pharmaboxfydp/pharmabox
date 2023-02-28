/// <reference types="cypress" />

function loginStaffCreatePatient() {
  cy.login(
    Cypress.env('test_staff_username_2'),
    Cypress.env('test_staff_password_2')
  )
}

function loginPharmacistCreatePatient() {
  cy.login(
    Cypress.env('test_pharmacist_username_1'),
    Cypress.env('test_pharmacist_password_1')
  )
}

describe('Create a new patient', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(1000)
  })
  it('Should load the add patient modal from a button click and close it', () => {
    // login as a pharmacist
    loginPharmacistCreatePatient()

    // wait to login
    cy.wait(1000)

    // go to patients page
    cy.get('[data-cy="Patients"]').click()

    // wait for patients page to load
    cy.wait(1000)

    // self authorize to create patient
    cy.get('[data-cy="pharmacist-authorization-toggle"]').click({ force: true })

    // wait for authorization
    cy.wait(1000)

    // click the add button
    cy.get('[data-cy="add-patient-button"]').click()

    // it should exist
    cy.get('[data-cy="add-patients-modal"]').should('exist')

    // close modal
    cy.get('[data-cy="close-modal"]').click()

    cy.get('[data-cy="add-patients-modal"]').should('not.exist')

    cy.get('[data-cy="pharmacist-authorization-toggle"]').click({ force: true })
  })

  it('Should allow a pharmacist to create a patient', () => {
    // login as a pharmacist
    loginPharmacistCreatePatient()

    // wait to login
    cy.wait(1000)

    // go to patients page
    cy.get('[data-cy="Patients"]').click()

    // wait for patients page to load
    cy.wait(1000)

    // self authorize to create patient
    cy.get('[data-cy="pharmacist-authorization-toggle"]').click({ force: true })

    // wait for authorization
    cy.wait(1000)

    // click the add button
    cy.get('[data-cy="add-patient-button"]').click()

    // it should exist
    cy.get('[data-cy="add-patients-modal"]').should('exist')

    // enter first name
    cy.get('#userFirstName').type('Seth')

    // enter last name
    cy.get('#userLastName').type('Rogen')

    // enter phone number
    cy.get('#phone').type('6478901234')
    // enter email
    cy.get('#email').type('seth.rogen@gmail.com')

    // submit form
    cy.get('#submit-add-patient-form').click()

    // close modal
    cy.get('body').trigger('keydown', { keyCode: 27 })
    cy.wait(500)
    cy.get('body').trigger('keyup', { keyCode: 27 })

    cy.get('[data-cy="pharmacist-authorization-toggle"]').click({ force: true })

    cy.get('[data-cy="search-last-name"]').type('rogen')
    cy.get('tr').should('have.length', 1 + 1)
    cy.get('span').contains('(647) 890-1234').should('exist')
    cy.get('span').contains('seth.rogen@gmail.com').should('exist')
    cy.get('span').contains('seth').should('exist')
    cy.get('span').contains('rogen').should('exist')
    cy.get('span').contains('0').should('exist')
    cy.get('span').contains('Enabled').should('exist')
  })
})

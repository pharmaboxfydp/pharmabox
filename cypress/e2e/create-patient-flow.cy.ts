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
})

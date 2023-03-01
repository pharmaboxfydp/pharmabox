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

    // should have the correct email
    cy.get('a').contains('Evalyn.Champlin60@hotmail.com').should('exist')

    // should have the correct phone number
    cy.get('a').contains('92722068514332').should('exist')

    // should have a pickup enabled checkbox
    cy.get("input[type='checkbox']").should('exist')

    // the dots menu should exist
    cy.get('[data-cy="dots-menu"]').should('exist')
  })

  it('Should allow a staff member to edit a patient', () => {
    // login as a staff member
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

    // click the dots menu
    cy.get('[data-cy="dots-menu"]').click()
    cy.get('button').contains('Edit Patient').click()

    // change the first name
    cy.get('#userFirstName').clear().type('Manny')

    // change the last name
    cy.get('#userLastName').clear().type('Howel')

    // submit the changes
    cy.get('button[type="submit"]')
      .contains('Update Patient Information')
      .click()

    // wait for the update
    cy.wait(1000)

    // check that the name has been updated
    cy.get('a').contains('Manny Howel').click()

    // wait for the page to load
    cy.wait(1000)

    // should have correct name
    cy.get('span').contains('Manny').should('exist')
    cy.get('span').contains('Howel').should('exist')

    cy.get('a').contains('Patients').click()

    // go to the patients page
    cy.wait(1000)
    cy.get('[data-cy="search-first-name"]').clear().type('Manny')
    cy.get('tr').should('have.length', 1 + 1)
    cy.get('span').contains('Manny').should('exist')
    cy.get('span').contains('Howel').should('exist')
  })
})

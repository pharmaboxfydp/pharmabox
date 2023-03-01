/// <reference types="cypress" />

function loginStaffAuthorization() {
  cy.login(
    Cypress.env('test_staff_username_2'),
    Cypress.env('test_staff_password_2')
  )
}

function loginPharmacistAuthorization() {
  cy.login(
    Cypress.env('test_pharmacist_username_1'),
    Cypress.env('test_pharmacist_password_1')
  )
}

describe('Authorization flow', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(1000)
  })
  it('Should allow a pharmacist to self authorize', () => {
    // login as pharmacist
    loginPharmacistAuthorization()

    // wait to load
    cy.wait(1000)

    // go to patients page
    cy.get('[data-cy="Patients"]').click()

    // check they cannot add a patient
    cy.get('[data-cy="add-patient-button"]').should('be.disabled')

    // go back to dashboard
    cy.get('[data-cy="Dashboard"]').click()

    // check that the toggle exists
    const authToggle = cy.get('[data-cy="pharmacist-authorization-toggle"]')
    authToggle.should('exist')
    authToggle.should('not.have.attr', 'checked')

    cy.wait(1000)

    // click the toggle
    cy.get('[data-cy="pharmacist-authorization-toggle"]').click({ force: true })

    // verify that it is checked
    cy.get('[data-cy="pharmacist-authorization-toggle"]').should('be.checked')

    // go to the patients page
    cy.get('[data-cy="Patients"]').click()

    // check that the add patients button is no longer disabled
    cy.get('[data-cy="add-patient-button"]').should('not.be.disabled')

    // go to the teams page
    cy.get('[data-cy="Team"]').click()

    // should only be the pharmacist who is authorized
    cy.get('[data-cy="authorized-user-card"]').should('have.length', 1)

    // user is a pharmacist
    cy.get('td')
      .contains('hnagri52+test+mail@gmail.com')
      .closest('tr')
      .find('td')
      .contains('Pharmacist')
      .should('exist')

    // user has standard permissions
    cy.get('td')
      .contains('hnagri52+test+mail@gmail.com')
      .closest('tr')
      .find('td')
      .contains('Standard')
      .should('exist')

    // toggle off the authorization
    cy.get('[data-cy="pharmacist-authorization-toggle"]').click({ force: true })

    // go to patients page
    cy.get('[data-cy="Patients"]').click()

    // check they cannot add a patient
    cy.get('[data-cy="add-patient-button"]').should('be.disabled')
  })

  it('Should allow a pharmacist to authorize a staff member', () => {
    // first login as a staff member and ensure that they are not authorized
    loginStaffAuthorization()

    cy.wait(1000)
    // go to patients page
    cy.get('[data-cy="Patients"]').click()

    // check they cannot add a patient
    cy.get('[data-cy="add-patient-button"]').should('be.disabled')

    // go to the teams page
    cy.get('[data-cy="Team"]').click()

    // user should be inactive
    cy.get('td')
      .contains('srobensparadise+test_staff@gmail.com')
      .closest('tr')
      .find('td')
      .contains('Inactive')
      .should('exist')

    // no uses should be authorized
    cy.get('[data-cy="authorized-user-card"]').should('not.exist')

    // logout as the staff
    cy.get('[data-cy="Logout"]').click()

    // wait for logout
    cy.wait(2000)

    // login as a pharmacist
    loginPharmacistAuthorization()

    // wait to load
    cy.wait(1000)

    // go to teams page
    cy.get('[data-cy="Team"]').click()

    // authorize themself
    cy.get('[data-cy="pharmacist-authorization-toggle"]').click({ force: true })

    // they should show up as authorized
    cy.get('[data-cy="authorized-user-card"]').should('have.length', 1)

    // pharmacist should authorize staff member
    cy.get('td')
      .contains('srobensparadise+test_staff@gmail.com')
      .closest('tr')
      .find('input')
      .click({ force: true })

    // there should be two users authorized
    cy.get('[data-cy="authorized-user-card"]').should('have.length', 2)

    // logout as a pharmacist
    cy.get('[data-cy="Logout"]').click()

    // wait for logout
    cy.wait(2000)

    // login as staff member
    loginStaffAuthorization()

    cy.wait(1000)
    // go to patients page
    cy.get('[data-cy="Patients"]').click()

    // check they can add a patient
    cy.get('[data-cy="add-patient-button"]').should('not.be.disabled')

    // should show correct authorizing pharmacist
    cy.get('[data-cy="supervising-pharmacist"]')
      .siblings('span')
      .contains('Hussein Nagri')
      .should('exist')

    // logout as a staff
    cy.get('[data-cy="Logout"]').click()

    // wait for logout
    cy.wait(2000)

    // login as a pharmacist
    loginPharmacistAuthorization()

    // wait for login

    cy.wait(1000)
    // go to teams page
    cy.get('[data-cy="Team"]').click()

    // authorize themself
    cy.get('[data-cy="pharmacist-authorization-toggle"]').click({ force: true })

    // no one should show up as authorized
    cy.get('[data-cy="authorized-user-card"]').should('have.length', 0)
  })
})

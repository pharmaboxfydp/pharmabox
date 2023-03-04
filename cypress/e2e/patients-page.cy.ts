/// <reference types="cypress" />

function loginStaffPatientsPage() {
  cy.login(
    Cypress.env('test_staff_username_1'),
    Cypress.env('test_staff_password_1')
  )
}

function goToPatientsPage() {
  loginStaffPatientsPage()
  cy.get('[data-cy="Patients"]').click()
}

describe('Patients Page and Table Search', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Should load the patients page correctly', () => {
    goToPatientsPage()

    // title exists
    cy.get('div').contains('Patients').should('exist')

    // table exists
    cy.get('table.patients-table').should('exist')

    // correct query
    cy.location().should((loc) => {
      expect(loc.search).to.equal('?step=20&page=1')
    })
    // table rows
    cy.get('tr').should('have.length', 20 + 1)

    // add patient button
    cy.get('[data-cy="add-patient-button"]')
      .should('exist')
      .and('have.attr', 'disabled')

    // table headers
    cy.get('span').contains('First Name').should('exist')
    cy.get('span').contains('Last Name').should('exist')
    cy.get('span').contains('Contact').should('exist')
    cy.get('span').contains('Rx Awaiting Pickup').should('exist')
    cy.get('span').contains('Status').should('exist')

    // search inputs
    cy.get('[data-cy="search-first-name"]')
      .should('exist')
      .and('have.value', '')
    cy.get('[data-cy="search-last-name"]').should('exist').and('have.value', '')
    cy.get('[data-cy="search-phone-number"]')
      .should('exist')
      .and('have.value', '')
    cy.get('[data-cy="search-email"]').should('exist').and('have.value', '')

    // clear search input exists
    cy.get('[data-cy="table-clear-search"]').should('exist')

    // should have correct value of step size
    cy.get('[data-cy="step-size"]').should('have.value', 20)
  })

  it('Should allow a user to search by first name', () => {
    goToPatientsPage()
    cy.wait(2000)
    // search for ee
    cy.get('[data-cy="search-first-name"]').type('ee')
    // should show 4 +1
    cy.get('tr').should('have.length', 6 + 1)
    cy.get('[data-cy="search-first-name"]').clear()
    cy.wait(1000)
    cy.get('[data-cy="search-first-name"]').type('kaycee')
    cy.get('tr').should('have.length', 1 + 1)
    cy.get('th').contains('Kaycee').should('exist')
    cy.get('td').contains('Powlowski').should('exist')
  })

  it('Should allow a user to search by last name', () => {
    goToPatientsPage()
    cy.wait(2000)
    // search for di
    cy.get('[data-cy="search-last-name"]').type('di')
    cy.get('tr').should('have.length', 1 + 1)
    cy.get('th').contains('Neoma').should('exist')
    cy.get('td').contains('Dickens').should('exist')
  })

  it('Should allow a user to search by phone number', () => {
    goToPatientsPage()
    cy.wait(2000)
    // search for 121
    cy.get('[data-cy="search-phone-number"]').type('121')
    cy.get('tr').should('have.length', 3 + 1)
    cy.get('[data-cy="search-phone-number"]').clear().type('1215')
    cy.get('tr').should('have.length', 1 + 1)
    cy.get('th').contains('Una').should('exist')
    cy.get('td').contains('Price').should('exist')
  })

  it('Should allow a user to search by email', () => {
    goToPatientsPage()
    cy.wait(2000)
    // search for smith
    cy.get('[data-cy="search-email"]').type('smith')
    cy.get('tr').should('have.length', 1 + 1)
    cy.get('th').contains('Aniyah').should('exist')
    cy.get('td').contains('Feeney').should('exist')
  })

  it('Should allow a user to conduct a combo search', () => {
    goToPatientsPage()
    cy.wait(2000)
    cy.get('[data-cy="search-first-name"]').type('ani')
    cy.wait(1000)
    cy.get('tr').should('have.length', 2 + 1)
    cy.get('[data-cy="search-email"]').type('smith')
    cy.wait(1000)
    cy.get('tr').should('have.length', 1 + 1)
    cy.get('th').contains('Aniyah').should('exist')
    cy.get('td').contains('Feeney').should('exist')
  })
})

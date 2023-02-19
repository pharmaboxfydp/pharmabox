/// <reference types="cypress" />

describe('Login Page', () => {
  it('Sould load the login page', () => {
    cy.visit('http://localhost:3000')
    cy.get('[data-test="product-tag"]')
  })
})

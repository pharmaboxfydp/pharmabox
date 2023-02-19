/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): Chainable<void>
    drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
  }
}

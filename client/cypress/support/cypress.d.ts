declare namespace Cypress {
  interface Chainable {
    home(): Chainable<Element>;
    checkDom(): Chainable<Element>;
    login(args: { email: string; password: string }): Chainable<Element>;
    joinRoom(args: { sit: number }): Chainable<Element>;
  }
}

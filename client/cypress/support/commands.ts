Cypress.Commands.add("home", () => {
  cy.visit("/");
});

Cypress.Commands.add("checkDom", () => {
  cy.get("nav").should("exist");
});

Cypress.Commands.add("login", ({ email, password }) => {
  cy.get("a > button").should("be.visible").first().click();

  cy.get("input[name=email]").type(email);
  cy.get("input[name=password]").type(password);
  cy.get("button").contains("Log in").click();
  cy.checkDom();
});

Cypress.Commands.add("joinRoom", ({ sit }) => {
  cy.get("div[data-id=rooms] > button > article")
    .should("be.visible")
    .first()
    .click();
  cy.get(`div[data-id=seats] div:nth-child(${sit}) button`)
    .should("be.visible")
    .click();
  cy.wait(500);
});

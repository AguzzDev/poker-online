describe("player 2 game", () => {
  beforeEach(() => {
    cy.home();
    cy.login({ email: "test2@test.com", password: "123456" });
  });
  it("join room", () => {
    cy.joinRoom({ sit: 2 });
    cy.get("div[data-id=info] h6").eq(2).should("contain", "2 / 4 Players");
    
    cy.wait(6000);
    cy.get("button[data-id=buttonPot-allIn]").click();
    cy.get("button[data-id=button-allIn]").click();
    cy.wait(10000);
  });
});

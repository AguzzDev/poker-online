describe("player 1 game", () => {
  beforeEach(() => {
    cy.home();
    cy.login({ email: "test1@test.com", password: "123456" });
  });
  it("join room", () => {
    cy.joinRoom({ sit: 1 });
    cy.wait(8000)
    cy.get("button[data-id=button-allIn]").click()
    cy.wait(10000)
  });
});

describe("join room test", () => {
  beforeEach(() => {
    cy.home();
  });
  it("join room and sit", () => {
    cy.login({ email: "test1@test.com", password: "123456" });
    cy.joinRoom({ sit: 1 });
    cy.get("div[data-id=info] h6").eq(2).should("contain", "1 / 4 Players");
  });
});

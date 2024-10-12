describe("login", () => {
  beforeEach(() => {
    cy.home();
  });
  it("login", () => {
    cy.login({ email: "test1@test.com", password: "123456" });
  });
});

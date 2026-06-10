describe("Login Page", () => {
  it("loads login form", () => {
    cy.visit("http://localhost:5173");

    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");

    cy.contains("Sign In").should("exist");
  });
});
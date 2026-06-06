describe("Login Page", () => {
  it("logs in successfully", () => {
    cy.visit("http://localhost:5173");

    cy.get('input[name="email"]')
      .type("admin@gmail.com");

    cy.get('input[name="password"]')
      .type("123456");

    cy.contains("Sign In").click();

    cy.url().should(
      "include",
      "/dashboard"
    );
  });
});
describe("Songs Library Explorer", () => {

  // PREREQUISITE USER LOGIN STEP
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.get('input[name="email"]').type("admin@gmail.com");
    cy.get('input[name="password"]').type("123456");
    cy.contains("Sign In").click();
    cy.url().should("include", "/dashboard");
  });

  it("opens songs page and checks brand element", () => {
    cy.visit("http://localhost:5173/songs");
    // NAVIGATE LIBRARY TRACKS CATALOGUE

    cy.contains("Music Library").should("exist");
    // VERIFY HEADER IDENTITY EXISTS
  });

});
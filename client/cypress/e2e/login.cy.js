describe("Authentication Flow", () => {

  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("should validate and sign in successfully", () => {
    // 🎯 FIX: Verify if your input name is "email" or "emailId"
    cy.get('input[name="email"]').type("admin@gmail.com");
    cy.get('input[name="password"]').type("123456");
    
    cy.contains("Sign In").click();
    // SUBMIT CREDENTIAL REQUISITES

    // Explicitly confirm url transition post-handshake
    cy.url({ timeout: 10000 }).should("include", "/dashboard");
    // VERIFY REDIRECT ROUTE ROUTING
  });

});
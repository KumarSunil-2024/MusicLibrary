describe("Playlist Operations", () => {

  // PREREQUISITE USER LOGIN STEP
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.get('input[name="email"]').type("admin@gmail.com");
    cy.get('input[name="password"]').type("123456");
    cy.contains("Sign In").click();
    cy.url().should("include", "/dashboard");
  });

  it("creates a new playlist collection record", () => {
    cy.visit("http://localhost:5173/playlists");
    // NAVIGATE PLAYLIST VIEW PORT

    cy.get("input").first().type("My Playlist");
    cy.contains("Create").click();
    // COMMIT NEW COLLECTION TITLE

    cy.contains("My Playlist").should("exist");
    // CONFIRM SEAMLESS RECORD RENDERING
  });

});
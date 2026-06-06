describe("Playlist", () => {
  it("creates playlist", () => {

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

    cy.visit(
      "http://localhost:5173/playlists"
    );

    cy.get("input")
      .first()
      .type("My Playlist");

    cy.contains("Create")
      .click();

    cy.contains("My Playlist")
      .should("exist");
  });
});
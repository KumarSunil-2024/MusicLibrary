describe("Playlist", () => {
  it("opens playlist page", () => {
    cy.visit("http://localhost:5173/playlists");

    cy.url().should("include", "/playlists");
  });
});
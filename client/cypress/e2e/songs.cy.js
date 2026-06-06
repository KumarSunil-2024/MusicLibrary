describe("Songs Page", () => {
  it("opens songs page", () => {
    cy.visit(
      "http://localhost:5173/songs"
    );

    cy.contains(
      "Music Library"
    ).should("exist");
  });
});
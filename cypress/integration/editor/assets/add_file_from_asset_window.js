describe("Add file from AssetWindow", () => {
  it("successfully add a asset file.", () => {
    cy.visit("/editor");
    cy.contains("Add File").find("input").attachFile("assets/bun33s.mp4");

    cy.contains("bun33s.mp4");
  });
});

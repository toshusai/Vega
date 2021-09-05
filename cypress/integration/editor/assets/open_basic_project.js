describe("Open Badic Project File", () => {
  it("successfully open project file.", () => {
    cy.visit("/editor");
    cy.contains("Add File").find("input").attachFile("assets/bun33s.mp4");

    cy.contains("bun33s.mp4");
  });
});

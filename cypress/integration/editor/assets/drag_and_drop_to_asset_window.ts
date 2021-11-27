describe("Drag and drop file to AssetWindow", () => {
  it("successfully drag and drop a asset file.", () => {
    cy.visit("/editor");
    cy.contains("Add File").attachFile("assets/bun33s.mp4", {
      subjectType: "drag-n-drop",
    });

    cy.contains("bun33s.mp4");
  });
});

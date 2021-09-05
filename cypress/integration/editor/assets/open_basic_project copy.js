describe("Open Badic Project File", () => {
  it("successfully open project file.", () => {
    cy.visit("/editor");
    cy.contains("Add File").attachFile("assets/bun33s.mp4", {
      subjectType: "drag-n-drop",
    });

    cy.contains("bun33s.mp4");
  });
});

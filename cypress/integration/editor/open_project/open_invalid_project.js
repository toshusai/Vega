describe("Open Invalid Project File", () => {
  it("fail open project file.", () => {
    cy.visit("/editor");
    cy.contains("Project").click();
    cy.contains("Open Project").click();
    cy.get("input").attachFile("project_files/not_json");

    cy.contains("Invalid project file format.");
  });
});

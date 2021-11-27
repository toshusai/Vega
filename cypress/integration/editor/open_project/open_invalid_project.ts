describe("Open Invalid Project File", () => {
  it("fail open project file.", () => {
    cy.visit("/editor");
    cy.get("[data-project-action-menu]").click();
    cy.contains("Open Project").click();
    cy.get("input").attachFile("project_files/not_json");

    cy.contains("Project file is not JSON format.");
  });
});

describe("Open v0.0.3 Project File", () => {
  it("successfully migration TextStrip to Text3DStrip", () => {
    cy.visit("/editor");
    cy.contains("Project").click();
    cy.contains("Open Project").click();
    cy.get("input").attachFile("project_files/v0_0_3.json");

    cy.get("[data-vega-text-3d-strip]");
  });
});

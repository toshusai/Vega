describe("Add Text Strip from Timeline", () => {
  it("successfully add text strip.", () => {
    cy.visit("/editor");
    cy.contains("Add File").attachFile("assets/bun33s.mp4");

    cy.get("[data-vega-timeline-container]").rightclick();
    cy.contains("Add Text").click();
    cy.get("[data-vega-text-strip]");
  });
});

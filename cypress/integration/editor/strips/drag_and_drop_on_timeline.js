describe("Add VideoStrip by D&D on Timeline", () => {
  it("successfully drag and drop on Timeline", () => {
    cy.visit("/editor");
    cy.wait(1000);
    cy.fixture("assets/bun33s.mp4", "binary").then((fileContent) => {
      cy.get("[data-vega-timeline-container]").attachFile(
        {
          fileContent,
          fileName: "bun33s.mp4",
          mimeType: "video/mp4",
          lastModified: new Date().getTime(),
        },
        { subjectType: "drag-n-drop" }
      );
    });
  });
});

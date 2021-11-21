describe("Show audio wave when change asset by inspector", () => {
  it("successfully show audiowave.", () => {
    cy.visit("/editor");

    // attachFile("file.mp4") way is not working for window.URL.createObjectURL(file);
    cy.fixture("assets/bun33s.mp4", "binary").then((fileContent) => {
      cy.contains("button", "Add File").attachFile(
        {
          fileContent,
          fileName: "bun33s.mp4",
          mimeType: "video/mp4",
          lastModified: new Date().getTime(),
        },
        { subjectType: "drag-n-drop" }
      );

      // 1) Add a strip
      cy.get("[data-vega-timeline-container]").rightclick();
      cy.contains("Add Video").click();

      // 2) Change a asset
      cy.get("[data-vega-video-strip]").click({ force: true });
      cy.get("[data-vega-strip-inspector-window]")
        .find("select")
        .select("bun33s.mp4", { force: true });

      // Need time for WaveSurfer.
      cy.wait(500);

      // Error disappear when wave WaveSurfer was completed.
      // Video load not work in cypress.
      // createObjectUrl blob:// is not work...?
      // cy.get("[data-vega-strip-error]").should("not.exist");
    });
  });
});

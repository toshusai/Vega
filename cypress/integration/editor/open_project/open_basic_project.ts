describe("Open Badic Project File", () => {
  it("successfully open project file.", () => {
    cy.visit("/editor");
    cy.get("[data-project-action-menu]").click();
    cy.contains("Open Project").click();
    cy.get("input").attachFile("project_files/basic.json");

    cy.get("[data-vega-settings-button]").click();

    // Project Name
    cy.contains("Project Name")
      .next()
      .find("input")
      .then((v) => {
        expect(v.val()).eq("Title");
      });

    // Why val == ''?
    // FPS
    // cy.contains("Fps")
    //   .next()
    //   .then((v) => {
    //     expect(v.val()).eq("30");
    //   });

    // Resolution  Width
    cy.contains("Resolution")
      .next()
      .find("input")
      .then((v) => {
        expect(v.val()).eq("720");
      });

    // Resolution Height
    cy.contains("Resolution")
      .next()
      .find("input")
      .eq(1)
      .then((v) => {
        expect(v.val()).eq("1200");
      });

    // Duration
    cy.contains("Duration")
      .next()
      .find("input")
      .then((v) => {
        expect(v.val()).eq("10");
      });
  });
});

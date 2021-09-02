describe("Open Badic Project File", () => {
  it("successfully open project file.", () => {
    cy.visit("/editor");
    cy.contains("Project").click();
    cy.contains("Open Project").click();
    cy.get("input").attachFile("project_files/basic.json");

    cy.contains("Open Project").should("not.exist");

    // Project Name
    cy.contains("name")
      .next()
      .find("input")
      .then((v) => {
        expect(v.val()).eq("Title");
      });

    // Duration
    cy.contains("duration")
      .next()
      .find("input")
      .then((v) => {
        expect(v.val()).eq("10");
      });

    // FPS
    cy.contains("fps")
      .next()
      .then((v) => {
        expect(v.val()).eq("30");
      });

    // Resolution  Width
    cy.contains("resolution")
      .next()
      .find("input")
      .then((v) => {
        expect(v.val()).eq("720");
      });

    // Resolution Height
    cy.contains("resolution")
      .next()
      .find("input")
      .eq(1)
      .then((v) => {
        expect(v.val()).eq("1200");
      });
  });
});

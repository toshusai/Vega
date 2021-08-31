describe("The Home Page", () => {
  it("successfully loads", () => {
    cy.visit("/");
    cy.contains("Vega is a open source browser based video editor.");
  });
});

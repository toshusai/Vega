describe("Editor", () => {
  it("successfully loads", () => {
    cy.visit("/editor");
    const play = cy.get("[data-vega-play-button]");
    play.click().wait(500).click();
    const children = cy.get("[data-vega-preview-window] .info").children();

    children
      .first()
      .invoke("text")
      .then((text) => {
        expect(text).satisfy(
          (text) => text != "00:00:00.0000",
          "[Timer is started]"
        );
      });
  });
});

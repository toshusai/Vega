describe("Editor", () => {
  it("successfully loads", () => {
    cy.visit("/editor");
    const play = cy.get(".controller-window button");
    play.click().wait(500).click();
    const children = cy.get(".preview-window .info").children();

    children
      .first()
      .invoke("text")
      .then((text) => {
        expect(text)
          .satisfy((text) => text.startsWith("TIME: "), "[startsWith]")
          .and.satisfy((text) => text.length == 19, "[length]")
          .and.satisfy(
            (text) => text != "TIME: 00:00:00.0000",
            "[Timer is started]"
          );
      });
  });
});

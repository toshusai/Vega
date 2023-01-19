import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
:root {
  --color-background-2: #222222;
  --color-background: #3a3a3a;
  --color-primary: red;

  --color-border: #545454;
  --color-input-background: #7a7a7a;
  --color-input-background-focus: #272727;
  --color-text: #ffffff;

  --color-text-strip: #076deb;
  --color-text-strip-border: #3e87e0;
  --color-strip-handle: #0000002e;
  --color-strip-selected: #ff8827;
}

body{
  margin: 0;
  height: 100vh;
  background-color: var(--color-background-2);
}
#__next{
  height: 100%;
}
`;

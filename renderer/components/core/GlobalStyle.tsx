import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
:root {
  --color-background-2: #2f2f2f;
  --color-background: #525252;
  --color-primary: red;
  --color-primary-hover: #0060d2;

  --color-border: #545454;
  --color-input-background: #7a7a7a;
  --color-input-background-focus: #272727;
  --color-text: #ffffff;

  --color-text-strip: #b3f9b7;
  --color-strip-handle: #2d2d2dbc;
  --color-strip-selected: #fa4949;
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

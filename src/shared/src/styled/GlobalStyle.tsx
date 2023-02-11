import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
:root {
  --color-background-2: #222222;
  --color-background: #3a3a3a;
  --color-primary: #136adf;
  --color-primary-bg: #1d1d1d;

  --color-border: #545454;
  --color-input-background: #7a7a7a;
  --color-input-background-focus: #272727;
  --color-input-background-disabled: #3a3a3a;
  --color-text: #ffffff;

  --color-text-strip: #136adf;
  --color-text-disabled: #545454;
  --color-text-strip-border: #3e87e0;
  --color-strip-handle: #0000002e;
  --color-strip-selected: #fb8d33;
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

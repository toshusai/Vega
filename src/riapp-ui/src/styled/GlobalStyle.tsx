import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
:root {
  --color-background-2: #222222;
  --color-background: #3a3a3a;
  --color-primary: #2c7be3;
  --color-primary-bg: #1d1d1d;

  --color-border: #545454;
  --color-input-background: #8b8b8b;
  --color-input-background-focus: #272727;
  --color-input-background-disabled: #3a3a3a;
  --color-text: #ffffff;

  --color-button-background: #5c5c5c;

  --color-text-strip: #3481e6;
  --color-text-disabled: #545454;
  --color-text-strip-border: #3e87e0;
  --color-strip-handle: #0000002e;
  --color-strip-selected: #fb8d33;
}

::-webkit-scrollbar {
    width: 8px;
    position: relative;
    background: var(--color-input-background);
    padding: 0;
    margin: 0;
    overflow: visible;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
::-webkit-scrollbar-thumb {
    background-color: var(--color-border);
    right: 0;
    border: 1px solid var(--color-input-background);
}
::-webkit-scrollbar-track {
  background: transparent;
}
body{
  margin: 0;
  height: 100vh;
  background-color: var(--color-background-2);

  color: white;
  font-family: "Ricty Diminished";
  position: relative;
  line-height: 16px;
  font-size: 12px;
}
#__next{
  height: 100%;
}
`;

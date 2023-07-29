import { createGlobalStyle } from "styled-components";

export const COLOR_BACKGROUND_NAME = "--color-background";
export const COLOR_BACKGROUND_2_NAME = "--color-background-2";
export const COLOR_PRIMARY_NAME = "--color-primary";
export const COLOR_PRIMARY_BG_NAME = "--color-primary-bg";
export const COLOR_BORDER_NAME = "--color-border";
export const COLOR_INPUT_BACKGROUND_NAME = "--color-input-background";
export const COLOR_INPUT_BACKGROUND_FOCUS_NAME =
  "--color-input-background-focus";
export const COLOR_INPUT_BACKGROUND_DISABLED_NAME =
  "--color-input-background-disabled";
export const COLOR_TEXT_NAME = "--color-text";
export const COLOR_BUTTON_BACKGROUND_NAME = "--color-button-background";
export const COLOR_TEXT_STRIP_NAME = "--color-text-strip";
export const COLOR_TEXT_DISABLED_NAME = "--color-text-disabled";
export const COLOR_TEXT_STRIP_BORDER_NAME = "--color-text-strip-border";
export const COLOR_STRIP_HANDLE_NAME = "--color-strip-handle";
export const COLOR_STRIP_SELECTED_NAME = "--color-strip-selected";

export const GlobalStyle = createGlobalStyle`
:root {
  ${COLOR_BACKGROUND_2_NAME}: #222222;
  ${COLOR_BACKGROUND_NAME}: #3a3a3a;
  ${COLOR_PRIMARY_NAME}: #2c7be3;
  ${COLOR_PRIMARY_BG_NAME}: #1d1d1d;

  ${COLOR_BORDER_NAME}: #545454;
  ${COLOR_INPUT_BACKGROUND_NAME}: #8b8b8b;
  ${COLOR_INPUT_BACKGROUND_FOCUS_NAME}: #272727;
  ${COLOR_INPUT_BACKGROUND_DISABLED_NAME}: #3a3a3a;
  ${COLOR_TEXT_NAME}: #ffffff;

  ${COLOR_BUTTON_BACKGROUND_NAME}: #5c5c5c;

  ${COLOR_TEXT_STRIP_NAME}: #3481e6;
  ${COLOR_TEXT_DISABLED_NAME}: #545454;
  ${COLOR_TEXT_STRIP_BORDER_NAME}: #3e87e0;
  ${COLOR_STRIP_HANDLE_NAME}: #0000002e;
  ${COLOR_STRIP_SELECTED_NAME}: #fb8d33;
}

::-webkit-scrollbar {
    width: 8px;
    position: relative;
    background: var(${COLOR_INPUT_BACKGROUND_NAME});
    padding: 0;
    margin: 0;
    overflow: visible;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
::-webkit-scrollbar-thumb {
    background-color: var(${COLOR_BORDER_NAME});
    right: 0;
    border: 1px solid var(${COLOR_INPUT_BACKGROUND_NAME});
}
::-webkit-scrollbar-track {
  background: transparent;
}
body{
  margin: 0;
  height: 100vh;
  background-color: var(${COLOR_BACKGROUND_2_NAME});

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

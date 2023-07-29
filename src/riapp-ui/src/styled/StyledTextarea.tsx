import styled from "styled-components";
import {
  COLOR_BORDER_NAME,
  COLOR_INPUT_BACKGROUND_FOCUS_NAME,
  COLOR_INPUT_BACKGROUND_NAME,
} from "./GlobalStyle";

export const StyledTextarea = styled.textarea`
  display: block;
  color: var(--color-text);
  box-sizing: border-box;
  font-size: 12px;
  line-height: 12px;
  margin: 0;
  border: 1px solid var(${COLOR_BORDER_NAME});
  background-color: var(${COLOR_INPUT_BACKGROUND_NAME});
  border-radius: 8px;
  height: 16px;
  padding-left: 8px;
  caret-color: red;
  max-width: 256px;

  resize: none;
  height: 42px;

  :focus {
    outline: none;
    border-radius: 8px;
    background-color: var(${COLOR_INPUT_BACKGROUND_FOCUS_NAME});
  }

  font-family: "Ricty Diminished";
`;

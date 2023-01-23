import styled from "styled-components";

export const StyledSelect = styled.select`
  display: block;
  color: var(--color-text);
  box-sizing: border-box;
  font-size: 12px;
  line-height: 12px;
  margin: 0;
  border: 1px solid var(--color-border);
  background-color: var(--color-input-background);
  border-radius: 8px;
  height: 16px;
  padding-left: 8px;
  caret-color: red;
  max-width: 128px;
  width: 128px;

  :focus {
    outline: none;
    border-radius: 8px;
    background-color: var(--color-input-background-focus);
  }

  font-family: "Ricty Diminished";
`;

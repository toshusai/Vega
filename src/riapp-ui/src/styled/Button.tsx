import styled from "styled-components";

export const Button = styled.button`
  cursor: pointer;
  display: block;
  color: var(--color-text);
  box-sizing: border-box;
  font-size: 12px;
  line-height: 12px;
  margin: 0;
  border: 1px solid var(--color-border);
  background-color: var(--color-button-background);
  border-radius: 4px;
  height: 16px;
  padding-left: 8px;
  max-width: 128px;
  :active {
    background-color: var(--color-input-background-focus);
  }
  :disabled {
    background-color: var(--color-input-background-disabled);
    color: var(--color-text-disabled);
  }
  font-family: "Ricty Diminished";
`;

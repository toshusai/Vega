import styled from "styled-components";

export const StyledCheckbox = styled.input`
  margin: 0;
  display: block;
  color: var(--color-text);
  box-sizing: border-box;
  font-size: 12px;
  line-height: 12px;
  border: 1px solid var(--color-border);
  background-color: var(--color-input-background);
  border-radius: 2px;
  height: 16px;
  width: 16px;
  padding-left: 8px;
  appearance: none;
  position: relative;
  :checked {
    &:after {
      content: "✔︎";
      position: absolute;
      left: 2px;
      top: 1px;
      font-size: 12px;
      color: white;
      transition: all 0.2s; /* on prévoit une animation */
    }
    accent-color: red;
    background: red;
  }
`;

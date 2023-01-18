import { FC } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
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

  :focus {
    outline: none;
    border-radius: 8px;
    background-color: var(--color-input-background-focus);
  }
`;

export const ClickEditInput: FC = () => {
  return <StyledInput />;
};

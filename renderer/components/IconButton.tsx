import styled from "styled-components";
import { ToolTip } from "./ToolTip";

export const IconButton = styled.button`
  position: relative;
  padding: 0;
  width: 16px;
  min-width: 16px;
  min-height: 16px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  display: flex;
  border-radius: 4px;
  background-color: var(--color-input-background);

  :hover > ${ToolTip} {
    opacity: 1;
  }
`;

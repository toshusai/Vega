import styled from "styled-components";
import { COLOR_BACKGROUND_2_NAME, COLOR_BACKGROUND_NAME } from "./styled";

export const ToolbarButton = styled.button`
  background-color: var(${COLOR_BACKGROUND_2_NAME});
  color: var(--color-text);
  border: 0;
  padding: 2px 8px;
  height: 16px;
  font-size: 12px;
  font-family: "Ricty Diminished";
  cursor: pointer;
  :hover {
    background-color: var(${COLOR_BACKGROUND_NAME});
  }
`;

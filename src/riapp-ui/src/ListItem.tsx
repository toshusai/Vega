import styled from "styled-components";
import { COLOR_HOVER_NAME, COLOR_TEXT_NAME, MONO_FONT_NAME } from "./styled";

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0 4px;
  height: 16px;
  background: transparent;
  border: none;
  color: var(${COLOR_TEXT_NAME});
  font-size: 12px;
  cursor: pointer;
  font-family: var(${MONO_FONT_NAME});
  :hover {
    background-color: var(${COLOR_HOVER_NAME});
  }
  :focus {
    background-color: var(${COLOR_HOVER_NAME});
    outline: 1px solid var(${COLOR_HOVER_NAME});
  }
`;

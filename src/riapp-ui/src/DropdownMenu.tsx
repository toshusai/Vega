import styled from "styled-components";
import {
  COLOR_BACKGROUND_2_NAME,
  COLOR_BACKGROUND_NAME,
  COLOR_BORDER_NAME,
} from "./styled";

export const DropdownMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 10000;
  top: 16px;
  left: 0;
  background-color: var(${COLOR_BACKGROUND_NAME});
  border: 1px solid var(${COLOR_BORDER_NAME});
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0px 0px 4px 0px var(${COLOR_BACKGROUND_2_NAME});
  white-space: nowrap;
`;

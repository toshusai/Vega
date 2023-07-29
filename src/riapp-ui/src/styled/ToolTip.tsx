import styled, { css } from "styled-components";
import { COLOR_BACKGROUND_2_NAME } from "./GlobalStyle";

const toolTipBase = css`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  border-radius: 4px;
  background-color: var(${COLOR_BACKGROUND_2_NAME});
  color: var(--color-text);
  font-size: 12px;
  white-space: nowrap;
  z-index: 10000;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
`;

export const ToolTip = styled.div`
  ${toolTipBase}
  top: calc(-100% + -16px);
`;
export const BottomToolTip = styled.div`
  ${toolTipBase}
  bottom: calc(-100% + -16px);
`;

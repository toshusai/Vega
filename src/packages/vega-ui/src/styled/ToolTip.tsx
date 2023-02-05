import styled, { css } from "styled-components";

const toolTipBase = css`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  border-radius: 4px;
  background-color: var(--color-background-2);
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

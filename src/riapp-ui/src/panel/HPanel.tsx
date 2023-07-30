import React, { FC } from "react";
import styled from "styled-components";

import { getDragHander } from "../utils/getDragHander";

import { DividerBox } from "./DividerBox";

const HPanelDivider = styled.div`
  min-width: 4px;
  min-height: 100%;
  background-color: var(--color-panel-divider);
  cursor: col-resize;
  user-select: none;
`;

const HBoxRoot = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

export const HPanel: FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  defaultRate?: number;
}> = (props) => {
  const [rate, setRate] = React.useState(props.defaultRate ?? 0.5);
  const leftWidth = `calc(${rate * 100}% - 2px)`;
  const rightWidth = `calc(${(1 - rate) * 100}% - 2px)`;
  const handleMouseDown = getDragHander((ctx) => {
    const { diffX } = ctx;
    const el = ctx.startEvent.target as HTMLElement;
    const ctxWidth = el.parentElement?.clientWidth ?? 0;
    const newRate = Math.max(0, Math.min(1, rate + diffX / ctxWidth));
    setRate(newRate);
  });
  return (
    <HBoxRoot>
      <DividerBox
        style={{
          width: leftWidth,
        }}
      >
        {props.left}
      </DividerBox>
      <HPanelDivider onMouseDown={handleMouseDown} />
      <DividerBox
        style={{
          width: rightWidth,
        }}
      >
        {props.right}
      </DividerBox>
    </HBoxRoot>
  );
};

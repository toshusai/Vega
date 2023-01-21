import React, { PropsWithChildren } from "react";
import { useRef } from "react";
import styled from "styled-components";

interface ContextMenuProps {
  show: boolean;
  e?: React.MouseEvent<HTMLDivElement, MouseEvent>;
  onClose: () => void;
}

const StyledDiv = styled.div.attrs<{
  x: number;
  y: number;
}>((p) => {
  return {
    style: {
      left: p.x + "px",
      top: p.y + "px",
    },
  };
})<{ x: number; y: number }>`
  position: fixed;
  background-color: var(--color-background-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 12px;
  line-height: 12px;
  border-radius: 4px;
  padding: 4px 4px;
  z-index: 10000;
`;

export const ContextMenu: React.FC<PropsWithChildren<ContextMenuProps>> = (
  props
) => {
  if (!props.show) return null;
  const ref = useRef<HTMLDivElement>(null);
  const mouseDown = (e) => {
    if (ref.current?.contains(e.target as Node)) {
      return;
    }
    props.onClose();
    window.removeEventListener("mousedown", mouseDown);
  };
  window.addEventListener("mousedown", mouseDown);
  return (
    <>
      <Overlay />
      <StyledDiv x={props.e?.pageX ?? 0} y={props.e?.pageY || 0} ref={ref}>
        {props.children}
      </StyledDiv>
    </>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.1);
`;

export const StyledContextMenuButton = styled.div`
  color: var(--text-color);
  font-size: 12px;
  line-height: 12px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 2px;
  :hover {
    background-color: var(--color-primary);
    color: white;
  }
`;

import React, { PropsWithChildren, ReactNode, useRef } from "react";
import styled from "styled-components";

interface ContextMenuProps {
  show: boolean;
  e?: React.MouseEvent<HTMLDivElement, MouseEvent>;
  onClose: () => void;
  children?: ReactNode;
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

export const ContextMenu: React.FC<ContextMenuProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  if (!props.show) return null;
  const mouseDown = (e: MouseEvent) => {
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

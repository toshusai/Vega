import { FC, memo } from "react";
import styled from "styled-components";
import { Strip } from "../../interfaces/Strip";

export const StripUI: FC<
  Strip & {
    pxPerSec: number;
    offset: number;
    fps: number;
    selected: boolean;
    invalid: boolean;
    onStripChange: (strip: Strip) => void;
    onClick: () => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseDownLeftHandle: (e: React.MouseEvent) => void;
    onMouseDownRightHandle: (e: React.MouseEvent) => void;
  }
> = (props) => {
  const height = 40;
  const gap = 4;

  const left = (props.start - props.offset) * props.pxPerSec;
  const width = props.length * props.pxPerSec;
  if (left + width < 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: `${left}px`,
        width: `${props.length * props.pxPerSec}px`,
        height: `${height}px`,
        top: `${props.layer * 40 + gap * (props.layer + 1)}px`,
        backgroundColor: "var(--color-text-strip)",
        border: props.selected
          ? "2px solid var(--color-strip-selected)"
          : "2px solid var(--color-text-strip-border)",
        borderRadius: "4px",
        userSelect: "none",
        boxSizing: "border-box",
        zIndex: props.invalid ? 100 : 0,
      }}
      // onMouseDown={handleMouseDownStrip}
      onMouseDown={props.onMouseDown}
    >
      <StripHandle
        onMouseDown={props.onMouseDownLeftHandle}
        style={{ left: "4px" }}
      />
      <StripHandle
        onMouseDown={props.onMouseDownRightHandle}
        style={{ right: "4px" }}
      />
      {props.invalid && (
        <div
          style={{
            position: "absolute",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            backgroundColor: "rgba(255, 0, 0, 0.64)",
            borderRadius: "4px",
          }}
        ></div>
      )}
    </div>
  );
};
const StripHandle = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 6px;
  top: 4px;
  border-radius: 8px;
  height: 28px;
  background-color: var(--color-strip-handle);
  cursor: ew-resize;
`;

export const MemoStripUI = memo(StripUI, (prev, next) => {
  return (
    prev.start === next.start &&
    prev.length === next.length &&
    prev.pxPerSec === next.pxPerSec &&
    prev.offset === next.offset &&
    prev.layer === next.layer &&
    prev.selected === next.selected &&
    prev.invalid === next.invalid &&
    prev.onMouseDown === next.onMouseDown &&
    prev.onClick === next.onClick &&
    prev.onStripChange === next.onStripChange &&
    prev.onMouseDownLeftHandle === next.onMouseDownLeftHandle &&
    prev.onMouseDownRightHandle === next.onMouseDownRightHandle
  );
});

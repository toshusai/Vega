import { FC, memo, useRef } from "react";
import styled from "styled-components";
import { getDragHander } from "./StripUI";

export const ScaleScrollBar: FC<{
  start: number;
  end: number;
  onScaleChange?: (start: number, end: number) => void;
}> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseDownLeftHandle = getDragHander((diffX) => {
    const newStart = props.start + diffX / ref.current!.clientWidth;
    if (newStart >= 0) {
      props.onScaleChange?.(newStart, props.end);
    }
  });

  const handleMouseDownRightHandle = getDragHander((diffX) => {
    const newEnd = props.end + diffX / ref.current!.clientWidth;
    if (newEnd <= 1) {
      props.onScaleChange?.(props.start, newEnd);
    }
  });

  const handleMouseDownStrip = getDragHander((diffX) => {
    const newStart = props.start + diffX / ref.current!.clientWidth;
    const newEnd = props.end + diffX / ref.current!.clientWidth;
    if (newStart >= 0 && newEnd <= 1) {
      props.onScaleChange?.(newStart, newEnd);
    }
  });

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: `${props.start}px`,
        bottom: "0",
        width: `100%`,
        height: "16px",
        backgroundColor: "gray",
        userSelect: "none",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          position: "absolute",
          borderRadius: "8px",
          left: `${props.start * 100}%`,
          width: `${(props.end - props.start) * 100}%`,
          height: "16px",
          backgroundColor: "var(--color-text-strip)",
        }}
        onMouseDown={handleMouseDownStrip}
      >
        <ScaleScrollBarHandle
          onMouseDown={handleMouseDownLeftHandle}
          style={{ left: "4px" }}
        />
        <ScaleScrollBarHandle
          onMouseDown={handleMouseDownRightHandle}
          style={{ right: "4px" }}
        />
      </div>
    </div>
  );
};
const ScaleScrollBarHandle = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8px;
  top: 4px;
  border-radius: 8px;
  height: 8px;
  background-color: var(--color-strip-handle);
  cursor: ew-resize;
`;

export const MemoScaleScrollBar = memo(ScaleScrollBar, (prev, next) => {
  return (
    prev.start === next.start &&
    prev.end === next.end &&
    prev.onScaleChange === next.onScaleChange
  );
});

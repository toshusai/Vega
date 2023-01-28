import { FC, memo, useRef } from "react";
import styled from "styled-components";

import { getDragHander } from "@/utils/getDragHander";

export const ScaleScrollBar: FC<{
  start: number;
  end: number;
  onScaleChange?: (start: number, end: number) => void;
  minimumRange?: number;
}> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseDownLeftHandle = getDragHander(({ diffX }) => {
    const newStart = Math.max(
      props.start + diffX / ref.current!.clientWidth,
      0
    );
    if (props.end - newStart < (props.minimumRange ?? 0)) return;
    props.onScaleChange?.(newStart, props.end);
  });

  const handleMouseDownRightHandle = getDragHander(({ diffX }) => {
    const newEnd = Math.min(props.end + diffX / ref.current!.clientWidth, 1);
    if (newEnd - props.start < (props.minimumRange ?? 0)) return;
    props.onScaleChange?.(props.start, newEnd);
  });

  const handleMouseDownStrip = getDragHander(({ diffX }) => {
    const newStart = props.start + diffX / ref.current!.clientWidth;
    const newEnd = props.end + diffX / ref.current!.clientWidth;
    if (newStart < 0) {
      props.onScaleChange?.(0, newEnd - newStart);
      return;
    } else if (newEnd > 1) {
      props.onScaleChange?.(newStart - (newEnd - 1), 1);
      return;
    }
    props.onScaleChange?.(newStart, newEnd);
  });

  const minimumWidthPx = 24;

  return (
    <div
      ref={ref}
      style={{
        left: `${props.start}px`,
        width: `100%`,
        minHeight: "16px",
        backgroundColor: "var(--color-input-background)",
        userSelect: "none",
        borderRadius: "8px",
        border: "1px solid var(--color-border)",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          borderRadius: "8px",
          left: `calc(${Math.max(
            0,
            (props.end - props.start) * (ref.current?.clientWidth ?? 0) <=
              minimumWidthPx
              ? (props.end - minimumWidthPx / (ref.current?.clientWidth ?? 0)) *
                  100
              : props.start * 100
          )}%)`,
          width: `calc(${(props.end - props.start) * 100}%)`,
          minWidth: `${minimumWidthPx}px`,
          height: "14px",
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
  width: 6px;
  top: 2px;
  border-radius: 8px;
  height: 10px;
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

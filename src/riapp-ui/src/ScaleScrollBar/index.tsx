import { FC, memo, useRef } from "react";
import styled from "styled-components";

import { getDragHander } from "../utils/getDragHander";

export const ScaleScrollBar: FC<{
  start: number;
  end: number;
  onScaleChange?: (start: number, end: number) => void;
  minimumRange?: number;
}> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseDownLeftHandle = getDragHander(({ diffX }) => {
    let newStart = Math.max(props.start + diffX / ref.current!.clientWidth, 0);
    const mimumWidthRate = minimumWidthPx / (ref.current?.clientWidth ?? 0);
    if (props.end - newStart < mimumWidthRate) {
      newStart = props.end - mimumWidthRate;
    }
    props.onScaleChange?.(newStart, props.end);
  });

  const handleMouseDownRightHandle = getDragHander(({ diffX }) => {
    let newEnd = Math.min(props.end + diffX / ref.current!.clientWidth, 1);
    const mimumWidthRate = minimumWidthPx / (ref.current?.clientWidth ?? 0);
    if (newEnd - props.start < mimumWidthRate) {
      newEnd = props.start + mimumWidthRate;
    }
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

  const minimumWidthPx = 17;

  return (
    <div
      ref={ref}
      style={{
        width: `100%`,
        minHeight: "10px",
        backgroundColor: "var(--color-input-background)",
        userSelect: "none",
        border: "1px solid var(--color-input-background)",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          left: `calc(${props.start * 100}%)`,
          width: `calc(${(props.end - props.start) * 100}%)`,
          minWidth: `${minimumWidthPx}px`,
          height: "8px",
          backgroundColor: "var(--color-border)",
        }}
        onMouseDown={handleMouseDownStrip}
      >
        <ScaleScrollBarHandle
          onMouseDown={handleMouseDownLeftHandle}
          style={{ left: "0px" }}
        />
        <ScaleScrollBarHandle
          onMouseDown={handleMouseDownRightHandle}
          style={{ right: "0px" }}
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
  height: 8px;
  background-color: #3a3a3a;
  cursor: pointer;
`;

export const MemoScaleScrollBar = memo(ScaleScrollBar, (prev, next) => {
  return (
    prev.start === next.start &&
    prev.end === next.end &&
    prev.onScaleChange === next.onScaleChange
  );
});

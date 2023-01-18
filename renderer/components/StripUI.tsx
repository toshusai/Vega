import { FC } from "react";
import styled from "styled-components";
import { Strip } from "../interfaces/Strip";
import { roundToFrame } from "./Timeline";

export const getDragHander = (
  cb: (x: number) => void,
  onDown?: (e: MouseEvent) => void
) => {
  return (e: React.MouseEvent) => {
    onDown?.(e.nativeEvent);
    e.stopPropagation();
    const startX = e.clientX;
    const handleMouseMove = (e: MouseEvent) => {
      const diffX = e.clientX - startX;
      cb(diffX);
    };
    const handleMouseUp = (e: MouseEvent) => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };
};

export const StripUI: FC<
  Strip & {
    pxPerSec: number;
    onStripChange: (strip: Strip) => void;
    offset: number;
    fps: number;
  }
> = (props) => {
  const height = 40;
  const gap = 4;

  const handleMouseDownLeftHandle = getDragHander((diffX) => {
    const newStart = props.start + diffX / props.pxPerSec;
    const newLength = props.length - diffX / props.pxPerSec;
    if (newStart >= 0 && newLength > 0) {
      props.onStripChange({
        ...props,
        start: roundToFrame(newStart, props.fps),
        length: roundToFrame(newLength, props.fps),
      });
    }
  });

  const handleMouseDownRightHandle = getDragHander((diffX) => {
    const newLength = props.length + diffX / props.pxPerSec;
    if (newLength > 0) {
      props.onStripChange({
        ...props,
        length: roundToFrame(newLength, props.fps),
      });
    }
  });

  const handleMouseDownStrip = getDragHander((diffX) => {
    const newStart = props.start + diffX / props.pxPerSec;
    if (newStart >= 0) {
      props.onStripChange({
        ...props,
        start: roundToFrame(newStart, props.fps),
      });
    }
  });

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
        borderRadius: "4px",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDownStrip}
    >
      <StripHandle
        onMouseDown={handleMouseDownLeftHandle}
        style={{ left: "4px" }}
      />
      <StripHandle
        onMouseDown={handleMouseDownRightHandle}
        style={{ right: "4px" }}
      />
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
  height: 32px;
  background-color: var(--color-strip-handle);
  cursor: ew-resize;
`;

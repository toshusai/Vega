import { FC, memo } from "react";
import styled from "styled-components";
import { Strip } from "../interfaces/Strip";
import { roundToFrame } from "./Timeline";

export const getDragHander = (
  cb: (x: number, y: number) => void,
  onDown?: (e: MouseEvent) => void
) => {
  return (e: React.MouseEvent) => {
    onDown?.(e.nativeEvent);
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const handleMouseMove = (e: MouseEvent) => {
      const diffX = e.clientX - startX;
      const diffY = e.clientY - startY;
      cb(diffX, diffY);
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
    selected: boolean;
    onClick: () => void;
  }
> = (props) => {
  const height = 40;
  const gap = 4;

  const handleMouseDownLeftHandle = getDragHander((diffX) => {
    let newStart = props.start + diffX / props.pxPerSec;
    let newLength = props.length - diffX / props.pxPerSec;
    if (newStart < 0) {
      newLength += newStart;
      newStart = 0;
    }
    if (newLength < 0) {
      newStart += newLength;
      newLength = 0;
    }
    props.onStripChange({
      effects: props.effects,
      layer: props.layer,
      id: props.id,
      start: roundToFrame(newStart, props.fps),
      length: roundToFrame(newLength, props.fps),
    });
  });

  const handleMouseDownRightHandle = getDragHander((diffX) => {
    let newLength = props.length + diffX / props.pxPerSec;
    if (newLength < 0) newLength = 0;

    props.onStripChange({
      effects: props.effects,
      layer: props.layer,
      id: props.id,
      start: props.start,
      length: roundToFrame(newLength, props.fps),
    });
  });

  const handleMouseDownStrip = getDragHander(
    (diffX, diffY) => {
      // TODO: move drag handler to parant for support multiple selection
      let newStart = props.start + diffX / props.pxPerSec;
      let layer = Math.round((props.layer * height + diffY) / (height + gap));
      if (newStart < 0) newStart = 0;
      if (layer < 0) layer = 0;
      props.onStripChange({
        effects: props.effects,
        layer: layer,
        id: props.id,
        start: roundToFrame(newStart, props.fps),
        length: props.length,
      });
    },
    () => {
      props.onClick();
    }
  );

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
    prev.selected === next.selected
  );
});

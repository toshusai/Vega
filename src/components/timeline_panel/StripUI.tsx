import { FC, useEffect, useRef } from "react";
import styled from "styled-components";

import { Strip } from "@/core/types";

import { AudioEffectStripUI } from "./AudioEffectStripUI";
import { ImageEffectStripUI } from "./ImageEffectStripUI";
import { TextEffectStripUI } from "./TextEffectStripUI";
import { VideoEffectStripUI } from "./VideoEffectStripUI";

export const STRIP_HEIGHT = 20;
export const STRIP_GAP = 1;

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
  const left = (props.start - props.offset) * props.pxPerSec;
  const width = props.length * props.pxPerSec;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {});

  const firstEffect = props.effects[0];
  if (firstEffect === undefined) return null;

  if (left + width < 0) return null;

  return (
    <StripUIRoot
      ref={ref}
      style={{
        left: `${left}px`,
        width: `${props.length * props.pxPerSec}px`,
        height: `${STRIP_HEIGHT}px`,
        top: `${props.layer * STRIP_HEIGHT + STRIP_GAP * props.layer}px`,
        zIndex: props.invalid ? 100 : 0,
      }}
      selected={props.selected}
      onMouseDown={props.onMouseDown}
    >
      {firstEffect.type === "text" && <TextEffectStripUI strip={props} />}
      {firstEffect.type === "image" && <ImageEffectStripUI strip={props} />}
      {firstEffect.type === "video" && <VideoEffectStripUI strip={props} />}
      {firstEffect.type === "audio" && <AudioEffectStripUI strip={props} />}
      <StripHandle
        onMouseDown={props.onMouseDownLeftHandle}
        style={{ left: "1px" }}
      />
      <StripHandle
        onMouseDown={props.onMouseDownRightHandle}
        style={{ right: "1px" }}
      />
      {props.invalid && <InvalidDiv />}
    </StripUIRoot>
  );
};

const InvalidDiv = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 0, 0, 0.64);
  border-radius: 4px;
`;

const StripUIRoot = styled.div<{ selected: boolean }>`
  position: absolute;
  background-color: var(--color-text-strip);
  user-select: none;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  border: 1px solid
    ${(props) =>
      props.selected
        ? "var(--color-strip-selected)"
        : "var(--color-text-strip-border)"};
`;

const StripHandle = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  top: 0px;
  background-color: var(--color-strip-handle);
  cursor: ew-resize;
`;

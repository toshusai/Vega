import { useMemo } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";

import {
  COLOR_PRIMARY_NAME,
  COLOR_STRIP_HANDLE_NAME,
  COLOR_STRIP_SELECTED_NAME,
} from "@/app-ui/src";
import { Strip } from "@/core";
import { useSelector } from "@/hooks/useSelector";
import { actions } from "@/store/scene";

import { getTouchDragHandler } from "./utils/getTouchDragHandler";

export function MobileStrip(props: {
  fps: number;
  offset: number;
  pxPerSec: number;
  strip: Strip;
}) {
  const dispatch = useDispatch();
  const selectedStripIds = useSelector((state) => state.scene.selectedStripIds);
  const isSelected = selectedStripIds.includes(props.strip.id);
  const handleTouchStart = useMemo(() => {
    return getTouchDragHandler({
      onStart: (e) => {
        if (!e.target) return;
        if (!(e.target instanceof HTMLElement)) return;
        dispatch(actions.setSelectedStripIds([props.strip.id]));
        return {
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          startLayer: props.strip.layer,
          startYOffset:
            e.touches[0].clientY - e.target.getBoundingClientRect().top,
        };
      },
      onMove: (ctx) => {
        if (ctx.prevE && ctx.data) {
          const dx = ctx.e.touches[0].clientX - ctx.data?.startX;
          const dy =
            ctx.e.touches[0].clientY -
            ctx.data?.startY +
            ctx.data.startYOffset +
            STRIP_GAP / 2;
          const newLayer =
            ctx.data.startLayer + Math.floor(dy / (STRIP_HEIGHT + STRIP_GAP));
          const strip: Strip = {
            ...props.strip,
            start: props.strip.start + dx / props.pxPerSec,
            layer: Math.max(0, newLayer),
          };
          dispatch(actions.updateStrip(strip));
        }
      },
    });
  }, [props.pxPerSec, props.strip, dispatch]);

  const handleLeftHandleTouchStart = useMemo(() => {
    return getTouchDragHandler({
      onStart: (e) => {
        if (!e.target) return;
        if (!(e.target instanceof HTMLElement)) return;
        e.stopImmediatePropagation();
        return {
          startX: e.touches[0].clientX,
          startLength: props.strip.length,
        };
      },
      onMove: (ctx) => {
        ctx.e.stopImmediatePropagation();
        if (ctx.prevE && ctx.data) {
          const dx = ctx.e.touches[0].clientX - ctx.data?.startX;
          const newStart = props.strip.start + dx / props.pxPerSec;
          const newLength = props.strip.length - dx / props.pxPerSec;
          const strip: Strip = {
            ...props.strip,
            start: newStart,
            length: newLength,
          };
          dispatch(actions.updateStrip(strip));
        }
      },
    });
  }, [props.pxPerSec, props.strip, dispatch]);

  const handleRightHandleTouchStart = useMemo(() => {
    return getTouchDragHandler({
      onStart: (e) => {
        if (!e.target) return;
        if (!(e.target instanceof HTMLElement)) return;
        e.stopImmediatePropagation();
        return {
          startX: e.touches[0].clientX,
          startLength: props.strip.length,
        };
      },
      onMove: (ctx) => {
        ctx.e.stopImmediatePropagation();
        if (ctx.prevE && ctx.data) {
          const dx = ctx.e.touches[0].clientX - ctx.data?.startX;
          const newLength = props.strip.length + dx / props.pxPerSec;
          const strip: Strip = {
            ...props.strip,
            length: newLength,
          };
          dispatch(actions.updateStrip(strip));
        }
      },
    });
  }, [props.pxPerSec, props.strip, dispatch]);

  return (
    <StripRoot
      onTouchStart={handleTouchStart}
      style={{
        left: `${(props.strip.start - props.offset) * props.pxPerSec}px`,
        width: `${props.strip.length * props.pxPerSec}px`,
        top: `${
          props.strip.layer * STRIP_HEIGHT + STRIP_GAP * (props.strip.layer + 1)
        }px`,
      }}
      $isSelected={isSelected}
    >
      <Handle onTouchStart={handleLeftHandleTouchStart} />
      <Handle
        onTouchStart={handleRightHandleTouchStart}
        css={css`
          left: unset;
          right: 4px;
        `}
      />
    </StripRoot>
  );
}
const STRIP_GAP = 4;
const STRIP_HEIGHT = 64;
const StripRoot = styled.div<{
  $isSelected?: boolean;
}>`
  position: absolute;
  height: ${STRIP_HEIGHT}px;
  background-color: var(${COLOR_PRIMARY_NAME});
  border-radius: 8px;
  box-sizing: border-box;
  outline: 1px solid
    ${(p) =>
      p.$isSelected ? "var(" + COLOR_STRIP_SELECTED_NAME + ")" : "transparent"};
`;
const Handle = styled.div`
  position: absolute;
  width: 8px;
  height: ${STRIP_HEIGHT - 4}px;
  width: 20px;
  top: 2px;
  left: 4px;
  background-color: var(${COLOR_STRIP_HANDLE_NAME});
  border-radius: 8px;
`;

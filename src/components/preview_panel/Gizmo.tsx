import { FC } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { getDragHander, SelectRectProps } from "@/app-ui/src";
import {
  ImageEffect,
  isImageEffect,
  isTextEffect,
  isVideoEffect,
  TextEffect,
  VideoEffect,
} from "@/core/types";
import { useSelector } from "@/hooks/useSelector";
import { actions } from "@/store/scene";
import { UndoManager } from "@/UndoManager";

import { createResizeHandler } from "./createResizeHandler";
import { useHandleSelectStrip } from "./useHandleSelectStrip";
import { makeNewKeyframes } from "./utils/makeNewKeyframes";
import { effectToRect } from "./utils/textEffectToRect";

export const Gizmo: FC<{
  left: number;
  top: number;
  scale: number;
  userSelectNone: boolean;
  onWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
}> = (props) => {
  const selectedStripIds = useSelector((state) => state.scene.selectedStripIds);
  const strips = useSelector((state) => state.scene.strips);
  const selectedStrips = strips.filter((s) => selectedStripIds.includes(s.id));
  const currentTime = useSelector((state) => state.scene.currentTime);
  const fps = useSelector((state) => state.scene.fps);
  const dispatch = useDispatch();

  const handleSelectStrip = useHandleSelectStrip();

  if (selectedStrips.length !== 1) {
    return null;
  }

  const strip = selectedStrips[0];

  const textEffects: (TextEffect | ImageEffect | VideoEffect)[] =
    strip.effects.filter((effect) => {
      return (
        isTextEffect(effect) || isImageEffect(effect) || isVideoEffect(effect)
      );
    }) as (TextEffect | ImageEffect | VideoEffect)[];

  if (textEffects.length !== 1) {
    return null;
  }
  const effect = textEffects[0];

  const rect = effectToRect(
    effect,
    props.scale,
    props.left,
    props.top,
    currentTime - strip.start,
    fps
  );
  if (!rect) return null;

  const emit = (partial: Partial<TextEffect | ImageEffect | VideoEffect>) => {
    const newKFs = makeNewKeyframes(
      partial,
      effect,
      currentTime,
      strip,
      fps
    );

    dispatch(
      actions.updateEffect({
        effect: {
          ...effect,
          ...partial,
          keyframes: newKFs ? newKFs : effect.keyframes,
        } as TextEffect,
        stripId: strip.id,
      })
    );
  };

  const handleMouseDown = getDragHander<
    {
      offsetX: number;
      offsetY: number;
    },
    void
  >(
    (ctx) => {
      emit({
        x: Math.round(effect.x + ctx.diffX / props.scale),
        y: Math.round(effect.y + ctx.diffY / props.scale),
      });
    },
    undefined,
    (ctx) => {
      if (ctx.diffX === 0 && ctx.diffY === 0) {
        handleSelectStrip(ctx.startEvent);
      }
      UndoManager.main
        .add({
          undo: () => {
            emit(effect);
          },
          redo: () =>
            emit({
              x: Math.round(effect.x + ctx.diffX / props.scale),
              y: Math.round(effect.y + ctx.diffY / props.scale),
            }),
        })
        .run();
    }
  );

  const handleResize = createResizeHandler(effect, props.scale, emit);
  const showControls = isImageEffect(effect);

  return (
    <StyledGizmo
      style={{
        pointerEvents: props.userSelectNone ? "none" : "auto",
      }}
      {...rect}
      onMouseDown={(e) => {
        handleMouseDown(e);
      }}
      onWheel={props.onWheel}
    >
      {showControls &&
        [Horizontal.Left, Horizontal.Right].map((horizontal) => {
          return [Vertical.Top, Vertical.Bottom].map((vertical) => {
            return (
              <GizmoControl
                key={`${horizontal}-${vertical}`}
                horizontal={horizontal}
                vertical={vertical}
                onMouseDown={(e) => handleResize(e, { horizontal, vertical })}
              />
            );
          });
        })}
    </StyledGizmo>
  );
};

export enum Horizontal {
  Left,
  Right,
}
export enum Vertical {
  Top,
  Bottom,
}

const StyledGizmo = styled.div.attrs<SelectRectProps>((props) => ({
  style: {
    left: props.$left + "px",
    top: props.$top + "px",
    width: props.$width + "px",
    height: props.$height + "px",
  },
}))<SelectRectProps>`
  position: absolute;
  border: 1px solid var(--color-primary);
  box-sizing: content-box;
  transform-origin: top left;
  transform: translate(-1px, -1px);
`;

const SIZE = 4;
const GizmoControl = styled.div<{
  horizontal: Horizontal;
  vertical: Vertical;
}>`
  position: absolute;
  width: ${SIZE}px;
  height: ${SIZE}px;
  background: white;
  border: 1px solid var(--color-primary);
  ${({ horizontal }) => {
    if (horizontal === Horizontal.Left) {
      return `
        left: -${SIZE / 2}px;
      `;
    } else {
      return `
        right: -${SIZE / 2}px;
      `;
    }
  }}
  ${({ vertical }) => {
    if (vertical === Vertical.Top) {
      return `
        top: -${SIZE / 2}px;
      `;
    } else {
      return `
        bottom: -${SIZE / 2}px;
      `;
    }
  }}
  cursor: ${({ horizontal, vertical }) => {
    if (horizontal === Horizontal.Left && vertical === Vertical.Top) {
      return "nwse-resize";
    } else if (horizontal === Horizontal.Right && vertical === Vertical.Top) {
      return "nesw-resize";
    } else if (horizontal === Horizontal.Left && vertical === Vertical.Bottom) {
      return "nesw-resize";
    } else {
      return "nwse-resize";
    }
  }}
`;

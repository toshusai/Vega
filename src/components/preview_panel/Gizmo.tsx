import { FC } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { ImageEffect, VideoEffect } from "vega-types";

import {
  isImageEffect,
  isTextEffect,
  isVideoEffect,
  TextEffect,
} from "@/core/types";
import { useSelector } from "@/hooks/useSelector";
import { getDragHander, SelectRectProps } from "@/riapp-ui/src";
import { actions } from "@/store/scene";
import { UndoManager } from "@/UndoManager";

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

  const rect = effectToRect(
    textEffects[0],
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
      textEffects[0],
      currentTime,
      strip,
      fps
    );

    dispatch(
      actions.updateEffect({
        effect: {
          ...textEffects[0],
          ...partial,
          keyframes: newKFs ? newKFs : textEffects[0].keyframes,
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
        x: Math.round(textEffects[0].x + ctx.diffX / props.scale),
        y: Math.round(textEffects[0].y + ctx.diffY / props.scale),
      });
    },
    undefined,
    (ctx) => {
      UndoManager.main
        .add({
          undo: () => {
            emit(textEffects[0]);
          },
          redo: () =>
            emit({
              x: Math.round(textEffects[0].x + ctx.diffX / props.scale),
              y: Math.round(textEffects[0].y + ctx.diffY / props.scale),
            }),
        })
        .run();
    }
  );

  return (
    <StyledGizmo
      style={{
        pointerEvents: props.userSelectNone ? "none" : "auto",
      }}
      {...rect}
      onMouseDown={handleMouseDown}
      onWheel={props.onWheel}
    />
  );
};

const StyledGizmo = styled.div.attrs<SelectRectProps>((props) => ({
  style: {
    left: props.$left + "px",
    top: props.$top + "px",
    width: props.$width + "px",
    height: props.$height + "px",
  },
}))<SelectRectProps>`
  position: absolute;
  border: 2px solid var(--color-primary);
  box-sizing: content-box;
  transform-origin: top left;
  transform: translate(-1px, -1px);
`;

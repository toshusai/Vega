import { FC } from "react";
import { useDispatch } from "react-redux";
import {
  TextEffect,
} from "../../interfaces/effects/TextEffect";
import { KeyFrame } from "../../interfaces/effects/KeyFrame";
import { isTextEffect } from "../../interfaces/effects/utils/isTextEffect";
import { actions } from "../../store/scene";
import { useSelector } from "../../store/useSelector";
import { UndoManager } from "../../UndoManager";
import { getDragHander } from "../../utils/getDragHander";
import styled from "styled-components";
import { SelectRectProps } from "../core/styled/SelectRect";
import { textEffectToRect } from "./utils/textEffectToRect";
import { exactKeyFrame } from "../../utils/exactKeyFrame";
import { uuid } from "short-uuid";
import { Ease } from "../../utils/easing";
import { roundToFrame } from "../../utils/roundToFrame";

export const Gizmo: FC<{
  left: number;
  top: number;
  scale: number;
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

  const textEffects = strip.effects.filter(isTextEffect);

  if (textEffects.length !== 1) {
    return null;
  }

  const rect = textEffectToRect(
    textEffects[0],
    props.scale,
    props.left,
    props.top,
    currentTime - strip.start,
    fps
  );
  if (!rect) return null;

  const emit = (partial: Partial<TextEffect>) => {
    const changedKeys = Object.keys(partial) as (keyof TextEffect)[];
    const newKFs: KeyFrame[] = [];
    changedKeys.forEach((key) => {
      const hasKeyFrame = textEffects[0].keyframes.some(
        (keyframe) => keyframe.property === key
      );
      if (hasKeyFrame) {
        const onKeyFrame = exactKeyFrame(
          textEffects[0],
          key,
          currentTime - strip.start
        );
        if (onKeyFrame) {
          newKFs.push({
            ...onKeyFrame,
            value: partial[key] as any,
          });
        } else {
          newKFs.push({
            id: uuid(),
            property: key,
            time: roundToFrame(currentTime - strip.start, fps),
            value: partial[key] as any,
            ease: Ease.Linear,
          });
        }
      }
    });

    const finalKeyFrames = [
      ...newKFs,
      ...textEffects[0].keyframes.filter(
        (keyframe) => !newKFs.find((kf) => kf.id === keyframe.id)
      ),
    ];

    dispatch(
      actions.updateEddect({
        effect: {
          ...textEffects[0],
          ...partial,
          keyframes: finalKeyFrames,
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

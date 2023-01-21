import { FC } from "react";
import { useDispatch } from "react-redux";
import { isTextEffect, TextEffect } from "../interfaces/TextEffect";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import { UndoManager } from "../KeyboardInput";
import { getDragHander } from "./getDragHander";
import styled from "styled-components";
import { SelectRectProps } from "./SelectRect";
import { textEffectToRect } from "./textEffectToRect";

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
    currentTime - strip.start
  );
  if (!rect) return null;

  const emit = (partial: Partial<TextEffect>) => {
    dispatch(
      actions.updateEddect({
        effect: {
          ...textEffects[0],
          ...partial,
        },
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

import {
  Effect,
  ImageEffect,
  isImageEffect,
  TextEffect,
  VideoEffect,
} from "@/core/types";
import { getDragHander } from "@/riapp-ui/src";
import { Key, KeyboardInput } from "@/riapp-ui/src/KeyboardInput";

import { Horizontal, Vertical } from "./Gizmo";

export function createResizeHandler(
  effect: Effect,
  scale: number,
  emit: (partial: Partial<TextEffect | ImageEffect | VideoEffect>) => void
) {
  const handleResize = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    {
      horizontal,
      vertical,
    }: {
      horizontal: Horizontal;
      vertical: Vertical;
    }
  ) => {
    e.stopPropagation();
    const handler = getDragHander((ctx) => {
      if (isImageEffect(effect)) {
        if (!effect.width || !effect.height) return;
        let x = effect.x;
        let y = effect.y;
        let width = effect.width;
        let height = effect.height;
        const rate = effect.width / effect.height;
        const useX = true;
        const addX = KeyboardInput.isPressed(Key.Shift)
          ? useX
            ? ctx.diffX
            : ctx.diffY * rate
          : ctx.diffX;
        const addY = KeyboardInput.isPressed(Key.Shift)
          ? useX
            ? ctx.diffX / rate
            : ctx.diffY
          : ctx.diffY;
        if (horizontal === Horizontal.Left) {
          x = effect.x + addX / scale;
          width = effect.width - addX / scale;
        } else {
          width = effect.width + addX / scale;
        }
        if (vertical === Vertical.Top) {
          height = effect.height - addY / scale;
          y = effect.y + addY / scale;
        } else {
          height = effect.height + addY / scale;
        }
        emit({ x, y, width, height });
      }
    });
    handler(e);
  };
  return handleResize;
}

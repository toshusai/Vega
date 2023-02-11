import { TextEffect } from "@/core/types";
import { calculateKeyFrameValue } from "@/rendering/calculateKeyFrameValue";
import {
  measureMap,
} from "@/rendering/updateTextEffect";
import { SelectRectProps } from "@/riapp-ui/src";

export function textEffectToRect(
  effect: TextEffect,
  scale: number,
  left: number,
  top: number,
  currentTime: number,
  fps: number
): SelectRectProps | null {
  let { x, y } = effect;
  x = calculateKeyFrameValue(effect.keyframes, currentTime, "x", effect.x, fps);
  y = calculateKeyFrameValue(effect.keyframes, currentTime, "y", effect.y, fps);

  const measure = measureMap.get(effect.id);
  if (!measure) {
    return null;
  }
  const lineBreaks = effect.text.split("\n").length - 1;
  return {
    $left: x * scale + left,
    $top: y * scale + top - (measure.height - effect.fontSize * lineBreaks) * scale,
    $width: measure.width * scale,
    $height: measure.height * scale,
  };
}

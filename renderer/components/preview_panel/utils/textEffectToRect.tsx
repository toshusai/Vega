import { TextEffect } from "../../../interfaces/effects/TextEffect";
import {
  caclulateKeyFrameValue,
  measureMap,
} from "../../../rendering/updateTextEffect";
import { SelectRectProps } from "../../core/styled/SelectRect";

export function textEffectToRect(
  effect: TextEffect,
  scale: number,
  left: number,
  top: number,
  currentTime: number,
  fps: number
): SelectRectProps | null {
  let { x, y } = effect;
  x = caclulateKeyFrameValue(effect.keyframes, currentTime, "x", effect.x, fps);
  y = caclulateKeyFrameValue(effect.keyframes, currentTime, "y", effect.y, fps);

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
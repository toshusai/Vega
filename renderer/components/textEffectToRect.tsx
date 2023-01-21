import { TextEffect } from "../interfaces/TextEffect";
import {
  caclulateKeyFrameValue,
  measureMap,
} from "../rendering/updateTextEffect";
import { SelectRectProps } from "./SelectRect";

export function textEffectToRect(
  effect: TextEffect,
  scale: number,
  left: number,
  top: number,
  currentTime: number
): SelectRectProps | null {
  let { x, y } = effect;
  x = caclulateKeyFrameValue(effect.keyframes, currentTime, "x", effect.x);
  y = caclulateKeyFrameValue(effect.keyframes, currentTime, "y", effect.y);

  const textHeight = effect.fontSize;
  const measure = measureMap.get(effect.id);
  if (!measure) {
    return null;
  }
  return {
    $left: x * scale + left,
    $top: y * scale + top - textHeight * scale,
    $width: measure.width * scale,
    $height: textHeight * scale,
  };
}

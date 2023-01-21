import { TextEffect } from "../interfaces/TextEffect";
import { measureMap } from "../rendering/updateTextEffect";
import { SelectRectProps } from "./SelectRect";

export function textEffectToRect(
  effect: TextEffect,
  scale: number,
  left: number,
  top: number): SelectRectProps | null {
  const { x, y } = effect;
  const textHeight = effect.fontSize
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

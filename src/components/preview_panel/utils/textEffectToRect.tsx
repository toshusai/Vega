import {
  Effect,
  ImageEffect,
  isImageEffect,
  isTextEffect,
  isVideoEffect,
  TextEffect,
  VideoEffect,
} from "@/core/types";
import { calculateKeyFrameValue } from "@/core/types/utils/calculateKeyFrameValue";
import { measureMap } from "@/rendering/updateTextEffect";
import { SelectRectProps } from "@/riapp-ui/src";

export function effectToRect(
  effect: Effect,
  scale: number,
  left: number,
  top: number,
  currentTime: number,
  fps: number
) {
  if (isTextEffect(effect)) {
    return textEffectToRect(effect, scale, left, top, currentTime, fps);
  }
  if (isImageEffect(effect) || isVideoEffect(effect)) {
    return imageEffectToRect(effect, scale, left, top, currentTime, fps);
  }
}

function imageEffectToRect(
  effect: ImageEffect | VideoEffect,
  scale: number,
  left: number,
  top: number,
  currentTime: number,
  fps: number
): SelectRectProps | null {
  let { x, y } = effect;
  x = calculateKeyFrameValue(effect.keyframes, currentTime, "x", effect.x, fps);
  y = calculateKeyFrameValue(effect.keyframes, currentTime, "y", effect.y, fps);

  return {
    $left: x * scale + left,
    $top: y * scale + top,
    $width: (effect.width ?? 0) * scale,
    $height: (effect.height ?? 0) * scale,
  };
}

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
  let $left = x * scale + left;
  if (effect.align === "center") {
    $left -= (measure.width / 2) * scale;
  } else if (effect.align === "right") {
    $left -= measure.width * scale;
  }
  console.log(left);

  return {
    $left,
    $top:
      y * scale + top - (measure.height - effect.fontSize * lineBreaks) * scale,
    $width: measure.width * scale,
    $height: measure.height * scale,
  };
}

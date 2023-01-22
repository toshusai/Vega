import { Effect } from "./effects/Effect";
import { ImageEffect } from "./effects/ImageEffect";

export function isImageEffect(effect: Effect): effect is ImageEffect {
  return effect.type === "image";
}

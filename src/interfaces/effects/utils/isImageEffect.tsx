import { ImageEffect } from "@/interfaces/effects/ImageEffect";
import { Effect } from "@/packages/types";

export function isImageEffect(effect: Effect): effect is ImageEffect {
  return effect.type === "image";
}

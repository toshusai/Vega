import { ImageEffect } from "@/effects";
import { Effect } from "@/effects";

export function isImageEffect(effect: Effect): effect is ImageEffect {
  return effect.type === "image";
}

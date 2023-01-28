import { Effect } from "@/packages/types";
import { ImageEffect } from "../ImageEffect";

export function isImageEffect(effect: Effect): effect is ImageEffect {
  return effect.type === "image";
}

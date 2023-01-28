import { TextEffect } from "@/effects";
import { Effect } from "@/effects";
import { hasKeyFrame } from "@/utils";

export function isTextEffect(effect: Effect): effect is TextEffect {
  return effect.type === "text" && hasKeyFrame(effect);
}

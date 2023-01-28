import { TextEffect } from "@/interfaces/effects/TextEffect";
import { hasKeyFrame } from "@/interfaces/utils/hasKeyFrame";
import { Effect } from "@/packages/types";

export function isTextEffect(effect: Effect): effect is TextEffect {
  return effect.type === "text" && hasKeyFrame(effect);
}

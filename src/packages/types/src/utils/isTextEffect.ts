import { Effect } from "../effects";
import { TextEffect } from "../effects/TextEffect";
import { hasKeyFrame } from "./hasKeyFrame";

export function isTextEffect(effect: Effect): effect is TextEffect {
  return effect.type === "text" && hasKeyFrame(effect);
}

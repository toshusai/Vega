import { Effect } from "../effects";
import { TextEffect } from "../effects/TextEffect";
import { hasKeyFrameProperty } from "./hasKeyFrame";

export function isTextEffect(effect: Effect): effect is TextEffect {
  return effect.type === "text" && hasKeyFrameProperty(effect);
}

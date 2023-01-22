import { Effect } from "../Effect";
import { TextEffect } from "../TextEffect";


export function isTextEffect(effect: Effect): effect is TextEffect {
  return effect.type === "text";
}

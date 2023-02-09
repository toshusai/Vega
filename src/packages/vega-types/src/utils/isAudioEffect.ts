import { AudioEffect } from "../effects";
import { Effect } from "../effects";

export function isAudioEffect(effect: Effect): effect is AudioEffect {
  return effect.type === "audio";
}

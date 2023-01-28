import { AudioEffect } from "@/interfaces/effects/AudioEffect";
import { Effect } from "@/packages/types";

export function isAudioEffect(effect: Effect): effect is AudioEffect {
  return effect.type === "audio";
}

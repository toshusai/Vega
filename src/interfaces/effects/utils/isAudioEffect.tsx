import { Effect } from "@/packages/types";

import { AudioEffect } from "../AudioEffect";

export function isAudioEffect(effect: Effect): effect is AudioEffect {
  return effect.type === "audio";
}

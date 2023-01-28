import { hasKeyFrame } from "@/components/keyframes_panel/KeyFramePanel";
import { Effect } from "@/packages/types";

import { TextEffect } from "../TextEffect";

export function isTextEffect(effect: Effect): effect is TextEffect {
  return effect.type === "text" && hasKeyFrame(effect);
}

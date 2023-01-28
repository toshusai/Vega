import { hasKeyFrame } from "@/components/keyframes_panel/KeyFramePanel";
import { TextEffect } from "@/interfaces/effects/TextEffect";
import { Effect } from "@/packages/types";

export function isTextEffect(effect: Effect): effect is TextEffect {
  return effect.type === "text" && hasKeyFrame(effect);
}

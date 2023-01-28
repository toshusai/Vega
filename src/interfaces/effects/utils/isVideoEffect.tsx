import { VideoEffect } from "@/interfaces/effects/VideoEffect";
import { Effect } from "@/packages/types";

export function isVideoEffect(effect: Effect): effect is VideoEffect {
  return effect.type === "video";
}

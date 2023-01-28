import { VideoEffect } from "@/effects";
import { Effect } from "@/effects";

export function isVideoEffect(effect: Effect): effect is VideoEffect {
  return effect.type === "video";
}

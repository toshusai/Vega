import { Effect } from "../Effect";
import { VideoEffect } from "../VideoEffect";

export function isVideoEffect(effect: Effect): effect is VideoEffect {
  return effect.type === "video";
}

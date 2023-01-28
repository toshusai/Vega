import { Effect } from "@/packages/types";

import { VideoEffect } from "../VideoEffect";

export function isVideoEffect(effect: Effect): effect is VideoEffect {
  return effect.type === "video";
}

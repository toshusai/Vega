import { Strip } from "@/shared/src";

import { checkOverlap } from "./checkOverlap";

const MAX_LAYER = 8;

export function canMove(
  strip: Strip,
  withoutSelectedStrips: Strip[],
  timelineLength: number
) {
  const isOverlap = checkOverlap(withoutSelectedStrips, strip);
  if (
    isOverlap ||
    strip.start < 0 ||
    strip.start + strip.length > timelineLength ||
    strip.layer < 0 ||
    strip.layer > MAX_LAYER-1
  ) {
    return false;
  }
  return true;
}

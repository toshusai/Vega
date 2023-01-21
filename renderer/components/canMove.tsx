import { checkOverlap } from "./checkOverlap";
import { Strip } from "../interfaces/Strip";

export function canMove(
  strip: Strip,
  withoutSelectedStrips: Strip[],
  timelineLength: number) {
  const isOverlap = checkOverlap(withoutSelectedStrips, strip);
  if (isOverlap ||
    strip.start < 0 ||
    strip.start + strip.length > timelineLength ||
    strip.layer < 0 ||
    strip.layer > 3) {
    return false;
  }
  return true;
}

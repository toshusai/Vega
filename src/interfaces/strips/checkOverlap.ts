import { Strip } from "@/core/types";

const DIFF = 1 / 60 / 2;
export function checkOverlap(strips: Strip[], strip: Strip): Strip | null {
  const isOverlapped = strips.findIndex((s) => {
    if (s.id === strip.id) {
      return false;
    }
    const isOverlapped =
      s.layer === strip.layer &&
      s.start < strip.start + strip.length - DIFF &&
      strip.start + DIFF < s.start + s.length;
    return isOverlapped;
  });
  return isOverlapped >= 0 ? strips[isOverlapped] : null;
}

import { Effect } from "@/packages/vega-types";

export function hasKeyFrame<T extends Effect>(
  effect: T,
  key: keyof T
) {
  if (!effect.keyframes) return false;
  return effect.keyframes.some((k) => k.property === key);
}

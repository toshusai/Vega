import { Effect } from "@/core/types";

export function hasKeyFrame<T extends Effect>(
  effect: T,
  key: keyof T
) {
  if (!effect.keyframes) return false;
  return effect.keyframes.some((k) => k.property === key);
}

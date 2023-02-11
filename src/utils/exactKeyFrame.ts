import { KeyFrame } from "@/shared/src";

export function exactKeyFrame<
  T extends {
    keyframes: KeyFrame[];
  }
>(effect: T, key: keyof T, time: number) {
  if (!effect.keyframes) {
    return false;
  }
  return effect.keyframes.find(
    (k) => k.property === key && Math.abs(k.time - time) < 1 / 60 / 2
  );
}

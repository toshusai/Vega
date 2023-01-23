import { KeyFrame } from "@/interfaces/effects/KeyFrame";

export function exactKeyFrame<
  T extends {
    keyframes: KeyFrame[];
  }
>(effect: T, key: keyof T, time: number) {
  if (!effect.keyframes) {
    console.log("no keyframes", effect, key);
    return;
  }
  return effect.keyframes.find(
    (k) => k.property === key && Math.abs(k.time - time) < 1 / 60 / 2
  );
}

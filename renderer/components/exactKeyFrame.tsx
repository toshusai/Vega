import { TextEffect } from "../interfaces/TextEffect";

export function exactKeyFrame(textEffect: TextEffect,
  key: keyof TextEffect,
  time: number) {
  return textEffect.keyframes.find(
    (k) => k.property === key && Math.abs(k.time - time) < Number.EPSILON
  );
}

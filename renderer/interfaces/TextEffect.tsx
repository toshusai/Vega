import { Ease } from "../components/easing";
import { Effect } from "./Effect";

export type TextEffect = {
  id: string;
  type: "text";
  text: string;
  x: number;
  y: number;
  fontAssetId: string;
  fontSize: number;
  keyframes: KeyFrame[];
};

export type KeyFrame = {
  time: number;
  value: number;
  property: string;
  ease: Ease;
};

export const isTextEffect = (effect: Effect): effect is TextEffect => {
  return effect.type === "text";
};

import { Effect } from "./Effect";

export type TextEffect = {
  id: string;
  type: "text";
  text: string;
  x: number;
  y: number;
  fontAssetId: string;
  fontSize: number;
};

export const isTextEffect = (effect: Effect): effect is TextEffect => {
  return effect.type === "text";
};

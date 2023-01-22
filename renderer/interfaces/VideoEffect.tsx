import { Effect } from "./Effect";
import { KeyFrame } from "./TextEffect";

export type VideoEffect = {
  id: string;
  type: "video";
  videoAssetId: string;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};

export const isVideoEffect = (effect: Effect): effect is VideoEffect => {
  return effect.type === "video";
};

export type ImageEffect = {
  id: string;
  type: "image";
  imageAssetId: string;
  x: number;
  y: number;
  keyframes: KeyFrame[];
};

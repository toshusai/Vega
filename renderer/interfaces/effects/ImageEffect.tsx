import { KeyFrame } from "./KeyFrame";

export type ImageEffect = {
  id: string;
  type: "image";
  imageAssetId: string;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  keyframes: KeyFrame[];
};

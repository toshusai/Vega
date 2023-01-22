import { KeyFrame } from "./KeyFrame";

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

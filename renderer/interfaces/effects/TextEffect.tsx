import { KeyFrame } from "./KeyFrame";

export type TextEffect = {
  id: string;
  type: "text";
  text: string;
  x: number;
  y: number;
  fontAssetId: string;
  fontSize: number;
  fontStyle?: string;
  keyframes: KeyFrame[];
};

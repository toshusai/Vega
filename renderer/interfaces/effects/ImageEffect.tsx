import { KeyFrame } from "./KeyFrame";

export type ImageEffect = {
  id: string;
  type: "image";
  imageAssetId: string;
  x: number;
  y: number;
  /**
   * @deprecated use width instead
   */
  scaleX?: number;
  /**
   * @deprecated use height instead
   */
  scaleY?: number;
  width?: number;
  height?: number;
  keyframes: KeyFrame[];
};

import { KeyFrame } from "./KeyFrame";

export type AudioEffect = {
  id: string;
  type: "audio";
  audioAssetId: string;
  volume: number;
  keyframes: KeyFrame[];
};

import { IVector3 } from "./IVector3";
import { StripEffect } from "./StripEffect";

export type VideoStripEffect = StripEffect & {
  start: number;
  position: IVector3;
  videoAssetId: string;
};

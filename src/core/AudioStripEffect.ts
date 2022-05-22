import { IVector3 } from "./IVector3";
import { StripEffect } from "./StripEffect";
import { Animation } from "./TextStripEffect";

export type AudioStripEffect = StripEffect & {
  /**
   * Offset in seconds from the start of the strip.
   */
  start: number;
  audioAssetId: string;
  animations: Animation[];
  volume: number;
};

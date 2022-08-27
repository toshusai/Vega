import { StripEffect } from './StripEffect'
import { Animation } from './Animation'

export type AudioStripEffect = StripEffect & {
  /**
   * Offset in seconds from the start of the strip.
   */
  start: number;
  audioAssetId: string;
  animations: Animation[];
  volume: number;
};

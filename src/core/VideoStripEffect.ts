import { IVector3 } from './IVector3'
import { StripEffect } from './StripEffect'
import { Animation } from './TextStripEffect'

export type VideoStripEffect = StripEffect & {
  start: number;
  position: IVector3;
  videoAssetId: string;
  animations: Animation[];
};
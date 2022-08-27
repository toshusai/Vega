import { IVector3 } from './IVector3'
import { StripEffect } from './StripEffect'
import { Animation } from './Animation'

export type VideoStripEffect = StripEffect & {
  start: number;
  position: IVector3;
  videoAssetId: string;
  volume: number;
  scale: IVector3
  animations: Animation[];
};

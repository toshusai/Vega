import { IVector3 } from '../IVector3'
import { Animation } from '../Animation'
import { StripEffect } from './StripEffect'

export type VideoStripEffect = StripEffect & {
  start: number;
  position: IVector3;
  videoAssetId: string;
  volume: number;
  scale: IVector3;
  animations: Animation[];
};

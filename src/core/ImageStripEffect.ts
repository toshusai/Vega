import { Vector2 } from 'three'
import { IVector3 } from './IVector3'
import { StripEffect } from './StripEffect'

export type ImageStripEffect = StripEffect & {
  type: 'Image',
  imageAssetId: string,
  scale: IVector3
  position: IVector3;
  opacity: number;
  animations: Animation[];
};

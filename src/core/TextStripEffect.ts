import { IVector3 } from './IVector3'
import { StripEffect } from './StripEffect'

export interface Animation {
  id: string;
  time: number;
  key: string;
  value: number;
}

export type TextStripEffect = StripEffect & {
  position: IVector3;
  text: string;
  size: number;
  color: string;
  characterSpace: number;
  style: string; // ex normal, bold, italic
  family: string; // ex serif Arial impact Monaco Papyrus ヒラギノ角ゴシック
  shadowColor: string;
  shadowBlur: number;

  outlineColor: string;
  outlineWidth: number;

  animations: Animation[];
};
import { IVector3 } from "./IVector3";
import { StripEffect } from "./StripEffect";

export type TextStripEffect = StripEffect & {
  position: IVector3;
  text: string;
  size: number;
  color: string;
};

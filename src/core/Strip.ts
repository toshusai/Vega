import { TextStripEffect } from "./TextStripEffect";
import { StripEffect } from "./StripEffect";
import { VideoStripEffect } from "./VideoStripEffect";

export interface Strip {
  id: string;
  start: number;
  length: number;
  layer: number;
  effects: (StripEffect | TextStripEffect | VideoStripEffect)[];
}

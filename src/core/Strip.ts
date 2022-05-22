import { TextStripEffect } from "./TextStripEffect";
import { StripEffect } from "./StripEffect";
import { VideoStripEffect } from "./VideoStripEffect";
import { AudioStripEffect } from "./AudioStripEffect";

export interface Strip {
  id: string;
  start: number;
  length: number;
  layer: number;
  effects: (
    | StripEffect
    | TextStripEffect
    | VideoStripEffect
    | AudioStripEffect
  )[];
}

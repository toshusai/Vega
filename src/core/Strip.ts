import { TextStripEffect } from "./TextStripEffect";
import { StripEffect } from "./StripEffect";
import { VideoStripEffect } from "./VideoStripEffect";

export class Strip {
  id: string;
  start: number;
  length: number;
  effects: (StripEffect | TextStripEffect | VideoStripEffect)[];
}

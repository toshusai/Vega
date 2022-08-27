import {
  TextStripEffect,
  VideoStripEffect,
  AudioStripEffect,
  StripEffect
} from './stripEffect'

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

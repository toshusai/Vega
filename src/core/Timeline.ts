import { Vector2 } from "three";

export interface Strip {
  id: string;
  start: number;
  length: number;
  effects: StripEffect[];
}

export interface StripEffect {
  id: string;
}

export type ImageStripEffect = StripEffect & {
  path: string;
  position: Vector2;
  scale: Vector2;
  opacity: number;
};

export interface Layer {
  strips: Strip[];
}

export interface Timeline {
  layers: Layer[];
  start: number;
  end: number;
  scale: number;
  length: number;
}

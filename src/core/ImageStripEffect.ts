import { Vector2 } from "three";
import { StripEffect } from "./StripEffect";

export type ImageStripEffect = StripEffect & {
  path: string;
  position: Vector2;
  scale: Vector2;
  opacity: number;
};

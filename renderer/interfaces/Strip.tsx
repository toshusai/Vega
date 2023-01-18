import { Effect } from "./Effect";

export type Strip = {
  id: string;
  start: number;
  length: number;
  effects: Effect[];
  layer: number;
};

import { Effect } from "../effects";
import { Strip } from "../Strip";

export type UseUpdateEffect = <T extends Effect>(
  effect: T,
  strip: Strip
) => {
  emit: (partial: Partial<T>) => void;
  addKeyFrame: (key: keyof T) => void;
};

export type UseStripTime = (strip: Strip) => number;

type PickProperties<T, TFilter> = {
  [K in keyof T as T[K] extends TFilter ? K : never]: T[K];
};

export type UseAnimationedValue = <T extends Effect>(
  effect: T,
  strip: Strip
) => (key: keyof PickProperties<T, number | undefined>) => number;

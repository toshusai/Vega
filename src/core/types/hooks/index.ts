import { PickProperties } from "../../../types/PickProperties";
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

export type UseAnimationedValue = <T extends Effect>(
  effect: T,
  strip: Strip
) => (key: keyof PickProperties<T, number | undefined>) => number;

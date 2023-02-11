import { VideoEffect } from "@/shared/src";
import { PickProperties } from "@/types/PickProperties";

type NumberProps = PickProperties<VideoEffect, number | undefined>;

const numberKeys: (keyof NumberProps)[] = ["x", "y", "width", "height"];

const scaleKeysMap: NumberProps = {
  x: 1,
  y: 1,
};

const viewKeysMap: {
  [key in keyof NumberProps]: (v: number) => string;
} = {
  x: (v) => v.toFixed(0),
  y: (v) => v.toFixed(0),
};

export const videoEffectOptions = {
  numberKeys,
  scaleKeysMap,
  viewKeysMap,
};

import { ImageEffect } from "@/packages/types";
import { PickProperties } from "@/types/PickProperties";

type NumberProps = PickProperties<ImageEffect, number | undefined>;

const numberKeys: (keyof NumberProps)[] = [
  "x",
  "y",
  "width",
  "height",
  "opacity",
];

const scaleKeysMap: NumberProps = {
  x: 1,
  y: 1,
  opacity: 0.01,
};

const viewKeysMap: {
  [key in keyof NumberProps]: (v: number) => string;
} = {
  x: (v: number) => v.toFixed(0),
  y: (v: number) => v.toFixed(0),
};

const minMaxKeysMap: {
  [key in keyof NumberProps]: [number, number] | undefined;
} = {
  x: undefined,
  y: undefined,
  opacity: [0, 1],
};

export const imageEffectOptions = {
  numberKeys,
  scaleKeysMap,
  viewKeysMap,
  minMaxKeysMap,
};

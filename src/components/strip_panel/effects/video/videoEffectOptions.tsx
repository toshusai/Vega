import { VideoEffect } from "@/core/types";
import { PickProperties } from "@/types/PickProperties";

type NumberProps = PickProperties<VideoEffect, number | undefined>;

const numberKeys: (keyof NumberProps)[] = [
  "x",
  "y",
  "width",
  "height",
  "playbackRate",
];

const scaleKeysMap: NumberProps = {
  x: 1,
  y: 1,
  playbackRate: 0.01,
};

const viewKeysMap: {
  [key in keyof NumberProps]: (v: number) => string;
} = {
  x: (v) => v.toFixed(0),
  y: (v) => v.toFixed(0),
  playbackRate: (v) => (v).toFixed(2),
};

export const minMaxMap: {
  [key in keyof NumberProps]: [number, number];
} = {
  x: [-Infinity, Infinity],
  y: [-Infinity, Infinity],
  width: [0, Infinity],
  height: [0, Infinity],
  playbackRate: [0, 100],
};

export const videoEffectOptions = {
  numberKeys,
  scaleKeysMap,
  viewKeysMap,
  minMaxMap,
};

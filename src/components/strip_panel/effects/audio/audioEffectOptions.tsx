import { AudioEffect } from "@/core/types";

const numberKeys: (keyof AudioEffect)[] = ["volume", "offset"];

const keyframesKeys: (keyof AudioEffect)[] = ["volume"];

const scaleKeysMap: {
  [key in keyof AudioEffect]?: number;
} = {
  volume: 0.01,
  offset: 0.01,
};

const minMaxKeysMap: {
  [key in keyof AudioEffect]?: [number, number];
} = {
  volume: [0, 1],
};

export const audioEffectOptions = {
  numberKeys,
  keyframesKeys,
  scaleKeysMap,
  minMaxKeysMap,
};

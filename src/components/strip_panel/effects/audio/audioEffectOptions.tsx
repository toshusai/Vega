import { AudioEffect } from "@/packages/types";

const numberKeys: (keyof AudioEffect)[] = ["volume", "offset"];

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
  scaleKeysMap,
  minMaxKeysMap,
};

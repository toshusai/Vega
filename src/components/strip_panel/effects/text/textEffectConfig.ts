import { TextEffect } from "@/core/types";
import { PickProperties } from "@/types/PickProperties";

type NumberProps = PickProperties<TextEffect, number | undefined>;
const numberKeys: (keyof NumberProps)[] = [
  "x",
  "y",
  "fontSize",
  "shadowBlur",
  "outlineWidth",
];
const stringKeys: (keyof TextEffect)[] = [
  "color",
  "outlineColor",
  "shadowColor",
];
const scaleKeysMap: NumberProps = {
  fontSize: 1,
  shadowBlur: 1,
  x: 1,
  y: 1,
};
const viewKeysMap: {
  [key in keyof NumberProps]: (v: number) => string;
} = {
  fontSize: (v) => v.toString(),
  x: (v) => v.toFixed(0),
  y: (v) => v.toFixed(0),
};
export const textEffectConfig = {
  numberKeys,
  stringKeys,
  scaleKeysMap,
  viewKeysMap,
};

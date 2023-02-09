import { Asset } from "./Asset";

export type FontAsset = Asset & {
  type: "font";
  path: string;
};

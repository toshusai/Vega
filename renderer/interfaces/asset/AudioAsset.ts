import { Asset } from "./Asset";

export type AudioAsset = Asset & {
  type: "audio";
  path: string;
};

import { Asset } from "./Asset";

export type VideoAsset = Asset & {
  type: "video";
  path: string;
};

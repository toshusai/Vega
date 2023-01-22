import { Asset } from "./Asset";

export type ImageAsset = Asset & {
  type: "image";
  path: string;
};

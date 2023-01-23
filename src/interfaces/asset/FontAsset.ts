import { Asset } from "../asset/Asset";

export type FontAsset = Asset & {
  type: "font";
  path: string;
};

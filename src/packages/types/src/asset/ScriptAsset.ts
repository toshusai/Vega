import { Asset } from "./Asset";

export type ScriptAsset = Asset & {
  type: "script";
  path: string;
};

export type ScriptMeta = {
  id: string;
  name: string;
  description: string;
  version: string;
};

export function isScriptAsset(asset: Asset): asset is ScriptAsset {
  return asset.type === "script";
}

import { IAsset, IAudioAsset, IFontAsset, IVideoAsset } from "./assets";
import { IStrip, IText3DStrip, IVideoStrip } from "./strips";

export interface Project {
  version: string;
  name: string;
  width: number;
  height: number;
  fps: number;
  duration: number;

  assets: (IAsset | IAudioAsset | IVideoAsset | IFontAsset)[];
  strips: (IStrip | IVideoStrip | IText3DStrip)[];
}

export function isProject(input: any): input is Project {
  return (
    typeof input.version == "string" &&
    typeof input.name == "string" &&
    typeof input.width == "number" &&
    typeof input.height == "number" &&
    typeof input.fps == "number" &&
    typeof input.duration == "number" &&
    Array.isArray(input.assets) &&
    input.assets.every((v: any) => isAsset(v)) &&
    Array.isArray(input.strips) &&
    input.assets.every((v: any) => isStrip(v))
  );
}

export function isAsset(input: any): input is IAsset {
  return (
    typeof input.id == "string" &&
    typeof input.name == "string" &&
    typeof input.type == "string"
  );
}

export function isStrip(input: any): input is IStrip {
  return (
    typeof input.id == "string" &&
    typeof input.start == "number" &&
    typeof input.length == "number" &&
    typeof input.layer == "number" &&
    typeof input.type == "string"
  );
}

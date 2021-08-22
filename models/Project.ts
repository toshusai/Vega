import { IAsset, IAudioAsset, IFontAsset, IVideoAsset } from "./assets";
import { IStrip, ITextStrip, IVideoStrip } from "./strips";

export interface Project {
  version: string;
  name: string;
  width: number;
  height: number;
  fps: number;
  duration: number;

  assets: (IAsset | IAudioAsset | IVideoAsset | IFontAsset)[];
  strips: (IStrip | IVideoStrip | ITextStrip)[];
}

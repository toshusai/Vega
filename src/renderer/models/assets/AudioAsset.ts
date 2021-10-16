import { Asset, IAsset } from "./Asset";

export type IAudioAsset = IAsset;

export class AudioAsset extends Asset implements IAudioAsset {
  type: string = "Audio";
}

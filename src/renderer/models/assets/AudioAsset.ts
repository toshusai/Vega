import { Asset, IAsset } from "./Asset";

export type IAudioAsset = IAsset;

const supportTypes = ["audio/wav", "audio/mp3", "audio/mpeg", "audio/ogg"];

export class AudioAsset extends Asset implements IAudioAsset {
  type: string = "Audio";

  public static isSupportType(type: string) {
    return supportTypes.includes(type);
  }
}

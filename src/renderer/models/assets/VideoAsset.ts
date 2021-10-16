import { Asset, IAsset } from "./Asset";

export type IVideoAsset = IAsset;

const supportTypes = ["video/mp4", "video/webm"];

export class VideoAsset extends Asset implements IVideoAsset {
  type: string = "Video";
  valid: boolean = false;

  public static isSupportType(type: string) {
    return supportTypes.includes(type);
  }
}

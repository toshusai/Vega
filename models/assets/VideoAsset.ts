import { Asset, IAsset } from "./Asset";

export type IVideoAsset = IAsset;

export class VideoAsset extends Asset implements IVideoAsset {
  type: string = "Video";
  valid: boolean = false;
}

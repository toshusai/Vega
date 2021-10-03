import { Asset, IAsset } from "./Asset";

export type IImageAsset = IAsset;

export class ImageAsset extends Asset implements IImageAsset {
  type: string = "Image";
  valid: boolean = false;
}

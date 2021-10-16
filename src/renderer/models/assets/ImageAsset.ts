import { Asset, IAsset } from "./Asset";

export type IImageAsset = IAsset;

const supportTypes = ["image/png", "image/jpg", "image/jpeg"];

export class ImageAsset extends Asset implements IImageAsset {
  type: string = "Image";
  valid: boolean = false;

  public static isSupportType(type: string) {
    return supportTypes.includes(type);
  }
}

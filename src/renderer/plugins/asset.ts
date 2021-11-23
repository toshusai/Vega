import {
  AudioAsset,
  FontAsset,
  IAsset,
  VideoAsset,
  ImageAsset,
} from "~/models/assets";

export class AssetUtil {
  public static interfacesToInstances(assets: IAsset[]) {
    return assets.map((a) => {
      switch (a.type) {
        case "Audio":
          return new AudioAsset(a.id, a.name, a.path);
        case "Video":
          return new VideoAsset(a.id, a.name, a.path);
        case "Font":
          return new FontAsset(a.id, a.name, a.path);
        case "Image":
          return new ImageAsset(a.id, a.name, a.path);
        default:
          throw new Error("Error Undefined Asset Type: " + a.type);
      }
    });
  }
}

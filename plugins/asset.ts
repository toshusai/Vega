import { AudioAsset, FontAsset, IAsset, VideoAsset } from "~/models/assets";

export class AssetUtil {
  public static interfacesToInstances(assets: IAsset[]) {
    return assets.map((a) => {
      switch (a.type) {
        case "Audio":
          return new AudioAsset(a.id, a.name, "");
        case "Video":
          return new VideoAsset(a.id, a.name, "");
        case "Font":
          return new FontAsset(a.id, a.name, "");
        default:
          throw new Error("Error Undefined Asset Type: " + a.type);
      }
    });
  }
}

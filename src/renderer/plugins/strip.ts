import { VegaError } from "./error";
import { Asset, AudioAsset, ImageAsset, VideoAsset } from "~/models";
import {
  AudioStrip,
  IImageStrip,
  ImageStrip,
  IStrip,
  IText3DStrip,
  ITextStrip,
  TextStrip,
  IVideoStrip,
  Text3DStrip,
  VideoStrip,
} from "~/models/strips";

export class StripUtil {
  public static interfacesToInstances(strips: IStrip[], assets: Asset[]) {
    const getAssetById = (id: string) => {
      return assets.find((a) => a.id == id);
    };
    return strips.map((s) => {
      if (s.type == "Video") {
        const ivs = JSON.parse(JSON.stringify(s)) as IVideoStrip;
        const va = getAssetById(ivs.assetId) as VideoAsset | undefined;
        return new VideoStrip(ivs, va);
      } else if (s.type == "Audio") {
        const ias = JSON.parse(JSON.stringify(s)) as IVideoStrip;
        const aa = getAssetById(ias.assetId) as AudioAsset | undefined;
        return new AudioStrip(s, aa);
      } else if (s.type == "Text3D") {
        const its = JSON.parse(JSON.stringify(s)) as IText3DStrip;
        return Text3DStrip.create(its, Text3DStrip.defaultFont);
      } else if (s.type == "Image") {
        const is = JSON.parse(JSON.stringify(s)) as IImageStrip;
        const aa = getAssetById(is.assetId) as ImageAsset | undefined;
        return new ImageStrip(is, aa);
      } else if (s.type == "Text") {
        const is = JSON.parse(JSON.stringify(s)) as ITextStrip;
        return new TextStrip(is);
      } else {
        throw new VegaError("Error Undefined Strip Type: " + s.type);
      }
    });
  }
}

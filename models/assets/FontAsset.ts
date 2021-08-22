import * as THREE from "three";
import { TextStrip } from "../strips";
import { Asset, IAsset } from "./Asset";

export type IFontAsset = IAsset;

export class FontAsset extends Asset implements IFontAsset {
  public static defaultFont: FontAsset;
  type: string = "Font";

  public static init() {
    return new Promise<void>((resolve, reject) => {
      try {
        const loader = new THREE.FontLoader();
        const defaultFontPath =
          "/static/assets/default/fonts/gentilis_bold.typeface.json";
        loader.load(
          defaultFontPath,
          (font) => {
            TextStrip.defaultFont = font;
            FontAsset.defaultFont = new FontAsset(
              "gentilis_bold",
              "gentilis_bold",
              defaultFontPath
            );
            resolve();
          },
          undefined,
          (e) => reject(e.error)
        );
      } catch (e) {
        reject(e);
      }
    });
  }
}

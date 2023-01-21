import { Asset, FontAsset } from "../interfaces/Asset";
import { Strip } from "../interfaces/Strip";
import { TextEffect } from "../interfaces/TextEffect";
import { SceneState } from "../store/scene";

const loadedFontAssetMap = new Map<string, boolean>();

export function isTextAsset(asset: Asset): asset is FontAsset {
  return asset.type === "font";
}

export function loadFont(fontAsset: FontAsset) {
  if (!loadedFontAssetMap.has(fontAsset.id) && fontAsset) {
    const style = document.createElement("style");
    style.innerHTML = `@font-face {
      font-family: ${fontAsset.name};
      src: url(${fontAsset.path});
    }`;
    document.head.appendChild(style);
    loadedFontAssetMap.set(fontAsset.id, true);
  }
}

export const measureMap = new Map<string, TextMetrics>();

export function updateTextEffect(
  ctx: CanvasRenderingContext2D,
  effect: TextEffect,
  strip: Strip,
  scene: SceneState
) {
  if (
    scene.currentTime < strip.start ||
    scene.currentTime > strip.start + strip.length
  ) {
    return;
  }
  const fontAsset = scene.assets.find(
    (asset) => asset.id === effect.fontAssetId
  );

  loadFont(fontAsset as FontAsset);

  ctx.fillStyle = "black";
  ctx.font = effect.fontSize + "px " + fontAsset?.name || "sans-serif";
  ctx.fillText(effect.text, effect.x, effect.y);
  const measure = ctx.measureText(effect.text);
  measureMap.set(effect.id, measure);
}

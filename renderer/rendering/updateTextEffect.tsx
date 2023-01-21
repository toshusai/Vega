import { Strip } from "../interfaces/Strip";
import { TextEffect } from "../interfaces/TextEffect";
import { SceneState } from "../store/scene";

const loadedFontAssetMap = new Map<string, boolean>();
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

  if (!loadedFontAssetMap.has(effect.fontAssetId) && fontAsset) {
    const style = document.createElement("style");
    style.innerHTML = `@font-face {
      font-family: ${fontAsset.name};
      src: url(${fontAsset.path});
    }`;
    document.head.appendChild(style);
    loadedFontAssetMap.set(effect.fontAssetId, true);
  }

  ctx.fillStyle = "black";
  ctx.font = "30px " + fontAsset?.name || "sans-serif";
  ctx.fillText(effect.text, effect.x, effect.y);
  const measure = ctx.measureText(effect.text);
  measureMap.set(effect.id, measure);
}

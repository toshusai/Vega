import { Asset, FontAsset, VideoAsset } from "../interfaces/Asset";
import { Strip } from "../interfaces/Strip";
import { KeyFrame, TextEffect } from "../interfaces/TextEffect";
import { SceneState } from "../store/scene";

const loadedFontAssetMap = new Map<string, boolean>();

export function isTextAsset(asset: Asset): asset is FontAsset {
  return asset.type === "font";
}
export function isVideoAsset(asset: Asset): asset is VideoAsset {
  return asset.type === "video";
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
  const x = caclulateKeyFrameValue(
    effect.keyframes,
    scene.currentTime - strip.start,
    "x",
    effect.x
  );

  ctx.fillText(effect.text, x, effect.y);
  const measure = ctx.measureText(effect.text);
  measureMap.set(effect.id, measure);
}

const caclulateKeyFrameValue = (
  keyframes: KeyFrame[],
  currentTime: number,
  property: string,
  defaultValue: number
) => {
  const prevKeyframe = keyframes.find(
    (k) => k.property === property && k.time < currentTime
  );
  const nextKeyframe = keyframes.find(
    (k) => k.property === property && k.time > currentTime
  );
  if (prevKeyframe && nextKeyframe) {
    const ratio =
      (currentTime - prevKeyframe.time) /
      (nextKeyframe.time - prevKeyframe.time);
    return (
      prevKeyframe.value + (nextKeyframe.value - prevKeyframe.value) * ratio
    );
  }
  return defaultValue;
};

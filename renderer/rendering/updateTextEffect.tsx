import { Ease, getEasingFunction } from "../utils/easing";
import { Asset } from "../interfaces/asset/Asset";
import { ImageAsset } from "../interfaces/asset/ImageAsset";
import { VideoAsset } from "../interfaces/asset/VideoAsset";
import { FontAsset } from "../interfaces/asset/FontAsset";
import { Strip } from "../interfaces/Strip";
import { TextEffect } from "../interfaces/effects/TextEffect";
import { KeyFrame } from "../interfaces/effects/KeyFrame";
import { SceneState } from "../store/scene";

const loadedFontAssetMap = new Map<string, boolean>();

export function isTextAsset(asset: Asset): asset is FontAsset {
  return asset.type === "font";
}
export function isVideoAsset(asset: Asset): asset is VideoAsset {
  return asset.type === "video";
}

export function isImageAsset(asset: Asset): asset is ImageAsset {
  return asset.type === "image";
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

  if (fontAsset) {
    loadFont(fontAsset as FontAsset);
  }

  ctx.fillStyle = "black";
  ctx.font = effect.fontSize + "px " + fontAsset?.name || "sans-serif";
  const x = caclulateKeyFrameValue(
    effect.keyframes,
    scene.currentTime - strip.start,
    "x",
    effect.x,
    scene.fps
  );

  const y = caclulateKeyFrameValue(
    effect.keyframes,
    scene.currentTime - strip.start,
    "y",
    effect.y,
    scene.fps
  );

  ctx.fillText(effect.text, x, y);
  const measure = ctx.measureText(effect.text);
  measureMap.set(effect.id, measure);
}

export const caclulateKeyFrameValue = (
  keyframes: KeyFrame[],
  currentTime: number,
  property: string,
  defaultValue: number,
  fps: number
) => {
  // const prevKeyframe = keyframes
  //   .find((k) => k.property === property && k.time < currentTime + 1 / fps);
  // const nextKeyframe = keyframes
  //   .find((k) => k.property === property && k.time > currentTime - 1 / fps);

  // get nearest prev keyframe
  const prevKeyframe = keyframes
    .filter((k) => k.property === property && k.time < currentTime + 1 / fps)
    .sort((a, b) => b.time - a.time)[0];
  // get nearest next keyframe
  const nextKeyframe = keyframes
    .filter((k) => k.property === property && k.time > currentTime - 1 / fps)
    .sort((a, b) => a.time - b.time)[0];

  if (!prevKeyframe && nextKeyframe) {
    return nextKeyframe.value;
  }
  if (prevKeyframe && !nextKeyframe) {
    return prevKeyframe.value;
  }
  if (prevKeyframe && nextKeyframe) {
    let ratio =
      (currentTime - prevKeyframe.time) /
      (nextKeyframe.time - prevKeyframe.time);
    const ease = getEasingFunction(prevKeyframe.ease || Ease.Linear);
    if (isNaN(ratio) || ratio === Infinity || ratio === -Infinity) {
      ratio = 0;
    }
    return (
      prevKeyframe.value +
      (nextKeyframe.value - prevKeyframe.value) * ease(ratio)
    );
  }
  return defaultValue;
};

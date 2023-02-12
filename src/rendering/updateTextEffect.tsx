import {
  Asset,
  AudioAsset,
  FontAsset,
  ImageAsset,
  Strip,
  TextEffect,
  VideoAsset,
} from "@/core/types";
import { calculateKeyFrameValue } from "@/core/types/utils/calculateKeyFrameValue";
import { SceneState } from "@/store/scene";
import { PickProperties } from "@/types/PickProperties";

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

export function isAudioAsset(asset: Asset): asset is AudioAsset {
  return asset.type === "audio";
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

export const measureMap = new Map<
  string,
  {
    width: number;
    height: number;
  }
>();

export function updateTextEffect(
  ctx: CanvasRenderingContext2D,
  effect: TextEffect,
  strip: Strip,
  scene: SceneState
) {
  if (
    scene.currentTime < strip.start ||
    scene.currentTime > strip.start + strip.length - 1 / scene.fps
  ) {
    return;
  }
  const fontAsset = scene.assets.find(
    (asset) => asset.id === effect.fontAssetId
  );

  if (fontAsset) {
    loadFont(fontAsset as FontAsset);
  }

  const animatedEffect: TextEffect = {
    ...effect,
  };
  Object.keys(effect).forEach((key) => {
    const k = key as keyof PickProperties<TextEffect, number>;
    const value = effect[k];
    if (typeof value !== "number") {
      return;
    }
    animatedEffect[k] = calculateKeyFrameValue(
      effect.keyframes,
      scene.currentTime - strip.start,
      key,
      value,
      scene.fps
    );
  });

  ctx.fillStyle = "black";
  ctx.font =
    (animatedEffect.fontStyle ?? "") +
      " " +
      animatedEffect.fontSize +
      "px " +
      fontAsset?.name || "sans-serif";

  const x = animatedEffect.x;
  const y = animatedEffect.y;
  let top = animatedEffect.y;
  let left = animatedEffect.x;
  let maxLeft = 0;
  const lineHeight = animatedEffect.fontSize;
  const characterSpacing = animatedEffect.characterSpacing ?? 0;
  ctx.shadowColor = animatedEffect.shadowColor ?? "transparent";
  ctx.shadowBlur = animatedEffect.shadowBlur ?? 0;
  ctx.lineJoin = "round";
  ctx.strokeStyle = animatedEffect.outlineColor ?? "transparent";
  ctx.lineWidth = animatedEffect.outlineWidth ?? 1;
  if ((animatedEffect.outlineWidth ?? 0) <= 1) {
    ctx.strokeStyle = "transparent";
  }
  for (let i = 0; i < animatedEffect.text.length; i++) {
    const char = animatedEffect.text[i];
    if (char === "\n") {
      top += lineHeight;
      left = x;
      continue;
    }
    const w = ctx.measureText(char).width;
    ctx.strokeText(char, left, top);
    left += w + characterSpacing;
    maxLeft = Math.max(maxLeft, left);
  }

  ctx.fillStyle = animatedEffect.color ?? "black";
  top = y;
  left = x;
  for (let i = 0; i < animatedEffect.text.length; i++) {
    const char = animatedEffect.text[i];
    if (char === "\n") {
      top += lineHeight;
      left = x;
      continue;
    }
    const w = ctx.measureText(char).width;
    ctx.fillText(char, left, top);
    left += w + characterSpacing;
    maxLeft = Math.max(maxLeft, left);
  }

  measureMap.set(animatedEffect.id, {
    width: maxLeft - x,
    height: top - y + lineHeight,
  });
}

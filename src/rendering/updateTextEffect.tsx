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
import { floorFrame } from "@/utils/roundToFrame";

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
      font-family: _${fontAsset.id};
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
  const currentFrame = floorFrame(scene.currentTime, scene.fps);
  const currentStripFrame = floorFrame(strip.start, scene.fps);
  const endFrame = floorFrame(strip.start + strip.length, scene.fps);
  if (currentFrame < currentStripFrame || currentFrame >= endFrame) {
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
    if (effect.keyframes.length === 0) {
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
    (fontAsset !== undefined ? "_" + fontAsset.id : "sans-serif");

  const x = animatedEffect.x;
  const y = animatedEffect.y;
  let top = animatedEffect.y;
  let left = animatedEffect.x;
  let width = 0;
  let maxWidth = 0;
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

  const lines = animatedEffect.text.split("\n");
  const lineWidths = lines.map((line) => {
    return ctx.measureText(line).width;
  });

  let lineIndex = 0;

  function moveAlign() {
    if (animatedEffect.align === "center") {
      left -= lineWidths[lineIndex] / 2;
      left -= ((lines[lineIndex].length - 1) * characterSpacing) / 2;
    } else if (animatedEffect.align === "right") {
      left -= lineWidths[lineIndex];
      left -= (lines[lineIndex].length - 1) * characterSpacing;
    }
  }

  moveAlign();
  for (let i = 0; i < animatedEffect.text.length; i++) {
    const char = animatedEffect.text[i];
    if (char === "\n") {
      top += lineHeight;
      left = x;
      lineIndex++;
      width = 0;
      moveAlign();
      continue;
    }
    const w = ctx.measureText(char).width;
    ctx.strokeText(char, left, top);
    left += w + characterSpacing;
    width += w + characterSpacing;
    maxWidth = Math.max(maxWidth, width);
  }

  ctx.fillStyle = animatedEffect.color ?? "black";
  top = y;
  left = x;
  lineIndex = 0;
  width = 0;
  moveAlign();
  for (let i = 0; i < animatedEffect.text.length; i++) {
    const char = animatedEffect.text[i];
    if (char === "\n") {
      top += lineHeight;
      left = x;
      lineIndex++;
      width = 0;
      moveAlign();
      continue;
    }
    const w = ctx.measureText(char).width;
    ctx.fillText(char, left, top);
    left += w + characterSpacing;
    width += w + characterSpacing;
    maxWidth = Math.max(maxWidth, width);
  }

  measureMap.set(animatedEffect.id, {
    width: maxWidth,
    height: top - y + lineHeight,
  });
}

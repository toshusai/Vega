import { ImageEffect, Strip } from "@/core/types";
import { calculateKeyFrameValue } from "@/core/types/utils/calculateKeyFrameValue";
import { SceneState } from "@/store/scene";
import { PickProperties } from "@/types/PickProperties";

const loadedImageElementMap = new Map<string, HTMLImageElement>();

export function getImageElement(effect: ImageEffect) {
  return loadedImageElementMap.get(effect.id + effect.imageAssetId);
}

export function updateImageEffect(
  ctx: CanvasRenderingContext2D,
  effect: ImageEffect,
  strip: Strip,
  scene: SceneState
) {
  const imageAsset = scene.assets.find(
    (asset) => asset.id === effect.imageAssetId
  );
  const elementMapKey = effect.id + effect.imageAssetId;
  if (
    scene.currentTime < strip.start ||
    scene.currentTime > strip.start + strip.length - 1 / scene.fps
  ) {
    const imageElement = loadedImageElementMap.get(elementMapKey);
    if (!imageElement) {
      return;
    }
    return;
  }
  if (imageAsset) {
    let imageElement = loadedImageElementMap.get(elementMapKey);
    if (!imageElement) {
      imageElement = document.createElement("img");
      loadedImageElementMap.set(elementMapKey, imageElement);
      imageElement.src = imageAsset.path;
    }

    const animatedEffect: ImageEffect = {
      ...effect,
    };
    Object.keys(effect).forEach((key) => {
      const k = key as keyof PickProperties<ImageEffect, number>;
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

    ctx.shadowColor = "";
    ctx.shadowBlur = 0;
    ctx.globalAlpha = animatedEffect.opacity ?? 1;

    let x = animatedEffect.x;
    let y = animatedEffect.y;
    let width = animatedEffect.width ?? imageElement.width;
    let height = animatedEffect.height ?? imageElement.height;
    let scaleX = 1;
    let scaleY = 1;
    if (width < 0) {
      scaleX = -1;
      width = width;
      x = -x;
    }
    if (height < 0) {
      scaleY = -1;
      height = height;
    }
    if (scaleX !== 1 || scaleY !== 1) {
      ctx.scale(scaleX, scaleY);
    }
    ctx.drawImage(
      imageElement,
      0,
      0,
      imageElement.width,
      imageElement.height,
      x,
      y,
      width,
      height
    );
    if (scaleX !== 1 || scaleY !== 1) {
      ctx.scale(scaleX, scaleY);
    }
    ctx.globalAlpha = 1;
  }
}

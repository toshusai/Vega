import { Strip } from "../interfaces/Strip";
import { ImageEffect } from "../interfaces/effects/ImageEffect";
import { SceneState } from "../store/scene";

const loadedImageElementMap = new Map<string, HTMLImageElement>();

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
    let imageElement = loadedImageElementMap.get(elementMapKey);
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

    ctx.drawImage(
      imageElement,
      0,
      0,
      imageElement.width,
      imageElement.height,
      effect.x,
      effect.y,
      imageElement.width * effect.scaleX,
      imageElement.height * effect.scaleY
    );
  }
}

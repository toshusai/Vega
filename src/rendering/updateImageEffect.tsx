import { Strip } from "../interfaces/Strip";
import { ImageEffect } from "../interfaces/effects/ImageEffect";
import { SceneState } from "../store/scene";
import { caclulateKeyFrameValue } from "./updateTextEffect";

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

    const animatedEffect: ImageEffect = {
      ...effect,
    };
    Object.keys(effect).forEach((key) => {
      animatedEffect[key] = caclulateKeyFrameValue(
        effect.keyframes,
        scene.currentTime - strip.start,
        key,
        effect[key],
        scene.fps
      );
    });

    ctx.shadowColor = "";
    ctx.shadowBlur = 0;
    ctx.globalAlpha = animatedEffect.opacity ?? 1;

    ctx.drawImage(
      imageElement,
      0,
      0,
      imageElement.width,
      imageElement.height,
      animatedEffect.x,
      animatedEffect.y,
      animatedEffect.width,
      animatedEffect.height
    );
    ctx.globalAlpha = 1;
  }
}

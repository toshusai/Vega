import { Strip } from "../interfaces/Strip";
import { VideoEffect } from "../interfaces/VideoEffect";
import { SceneState } from "../store/scene";

const loadedVideoElementMap = new Map<string, HTMLVideoElement>();
const videoStatusMap = new Map<string, VideoStatus>();
enum VideoStatus {
  Loading,
  Playing,
  Paused,
  Seeking
}
const modeLoadingBlack = false;

export function updateVideoEffect(
  ctx: CanvasRenderingContext2D,
  effect: VideoEffect,
  strip: Strip,
  scene: SceneState
) {
  if (scene.currentTime < strip.start ||
    scene.currentTime > strip.start + strip.length) {
    return;
  }
  const videoAsset = scene.assets.find(
    (asset) => asset.id === effect.videoAssetId
  );
  if (videoAsset) {
    let videoElement = loadedVideoElementMap.get(videoAsset.id);
    if (!videoElement) {
      videoElement = document.createElement("video");
      loadedVideoElementMap.set(videoAsset.id, videoElement);
      videoElement.src = videoAsset.path;
      videoElement.autoplay = true;
    }
    videoStatusMap.set(videoAsset.id, VideoStatus.Loading);
    videoElement.onloadeddata = () => {
      videoStatusMap.set(videoAsset.id, VideoStatus.Paused);
      videoElement.pause();
    };
    videoElement.onseeked = () => {
      if (videoStatusMap.get(videoAsset.id) === VideoStatus.Seeking) {
        videoStatusMap.set(videoAsset.id, VideoStatus.Paused);
      }
    };
    const diff = Math.abs(
      videoElement.currentTime - scene.currentTime + strip.start
    );
    if (diff > 1 / scene.fps) {
      videoElement.currentTime = scene.currentTime - strip.start;
      videoStatusMap.set(videoAsset.id, VideoStatus.Seeking);
    }
    if (videoStatusMap.get(videoAsset.id) === VideoStatus.Seeking &&
      modeLoadingBlack) {
      ctx.fillStyle = "black";
      ctx.fillRect(
        effect.x,
        effect.y,
        videoElement.videoWidth,
        videoElement.videoHeight
      );
    } else {
      ctx.drawImage(
        videoElement,
        effect.x,
        effect.y,
        videoElement.videoWidth,
        videoElement.videoHeight,
        effect.x,
        effect.y,
        ctx.canvas.width,
        ctx.canvas.height
      );
    }
  }
}

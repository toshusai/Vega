import { Strip } from "../interfaces/Strip";
import { VideoEffect } from "../interfaces/VideoEffect";
import { SceneState } from "../store/scene";

const loadedVideoElementMap = new Map<string, HTMLVideoElement>();
const videoStatusMap = new Map<string, VideoStatus>();
enum VideoStatus {
  Loading,
  Playing,
  Paused,
  Seeking,
}
const modeLoadingBlack = false;

export function updateVideoEffect(
  ctx: CanvasRenderingContext2D,
  effect: VideoEffect,
  strip: Strip,
  scene: SceneState
) {
  const videoAsset = scene.assets.find(
    (asset) => asset.id === effect.videoAssetId
  );
  if (
    scene.currentTime < strip.start ||
    scene.currentTime > strip.start + strip.length
  ) {
    videoStatusMap.set(effect.videoAssetId, VideoStatus.Paused);
    let videoElement = loadedVideoElementMap.get(videoAsset.id);
    if (!videoElement) {
      return;
    }
    videoElement.pause();
    videoElement.currentTime = 0;
    return;
  }
  if (videoAsset) {
    let videoElement = loadedVideoElementMap.get(videoAsset.id);
    if (!videoElement) {
      videoElement = document.createElement("video");
      loadedVideoElementMap.set(videoAsset.id, videoElement);
      videoElement.src = videoAsset.path;
      videoElement.autoplay = true;
      videoStatusMap.set(videoAsset.id, VideoStatus.Loading);
    }
    videoElement.onloadeddata = () => {
      videoStatusMap.set(videoAsset.id, VideoStatus.Paused);
      videoElement.pause();
    };
    const currentStatus = videoStatusMap.get(videoAsset.id);
    if (currentStatus === VideoStatus.Loading) {
      return;
    }
    videoElement.onseeked = () => {
      if (scene.isPlaying) {
        videoElement.play();
        videoStatusMap.set(videoAsset.id, VideoStatus.Playing);
      } else {
        videoElement.pause();
        videoStatusMap.set(videoAsset.id, VideoStatus.Paused);
      }
    };
    videoElement.onplay = () => {
      videoStatusMap.set(videoAsset.id, VideoStatus.Playing);
    };
    videoElement.onpause = () => {
      videoStatusMap.set(videoAsset.id, VideoStatus.Paused);
    };
    const gapFrames = 5;
    const diff = Math.abs(
      videoElement.currentTime - scene.currentTime + strip.start
    );
    if (currentStatus === VideoStatus.Playing && !scene.isPlaying) {
      videoElement.pause();
    } else if (currentStatus === VideoStatus.Paused && scene.isPlaying) {
      videoElement.play();
    } else if (
      diff > (1 / scene.fps) * gapFrames &&
      currentStatus !== VideoStatus.Seeking
    ) {
      // should seek if video currentTime is too far from scene currentTime
      videoElement.currentTime = scene.currentTime - strip.start;
      videoStatusMap.set(videoAsset.id, VideoStatus.Seeking);
    } else if (currentStatus === VideoStatus.Seeking && modeLoadingBlack) {
      ctx.fillStyle = "black";
      ctx.fillRect(
        effect.x,
        effect.y,
        videoElement.videoWidth,
        videoElement.videoHeight
      );
    }
    if (currentStatus === VideoStatus.Seeking) {
      return;
    }
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

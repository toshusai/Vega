import { Asset, AudioEffect, Strip } from "@/core/types";
import { calculateKeyFrameValue } from "@/core/types/utils/calculateKeyFrameValue";
import { SceneState } from "@/store/scene";

const loadedAudioElementMap = new Map<string, HTMLAudioElement>();

enum AudioStatus {
  Loading = "loading",
  Playing = "playing",
  Paused = "paused",
  Seeking = "seeking",
  Deleted = "deleted",
}

const audioStatusMap = new Map<string, AudioStatus>();

const modeLoadingBlack = false;

function getKeyForEffect(effect: AudioEffect) {
  return effect.id + effect.audioAssetId;
}

export function getAudioElement(effect: AudioEffect) {
  const key = getKeyForEffect(effect);
  return loadedAudioElementMap.get(key) || null;
}

export function releaseAudioAsset(effect: AudioEffect) {
  const key = getKeyForEffect(effect);
  audioStatusMap.set(key, AudioStatus.Deleted);
  const audioElement = loadedAudioElementMap.get(key);
  if (audioElement) {
    audioElement.pause();
    audioElement.remove();
    loadedAudioElementMap.delete(key);
  }
}

export function createAudioElementOrGetFromCache(
  effect: AudioEffect,
  audioAsset: Asset
) {
  const key = getKeyForEffect(effect);
  if (loadedAudioElementMap.has(key)) {
    return loadedAudioElementMap.get(key) as HTMLAudioElement;
  }
  const audioElement = document.createElement("audio");
  loadedAudioElementMap.set(key, audioElement);
  audioElement.src = audioAsset.path;
  audioElement.autoplay = true;
  audioElement.style.display = "none";
  document.body.appendChild(audioElement);
  audioStatusMap.set(key, AudioStatus.Loading);
  audioElement.onloadeddata = () => {
    audioStatusMap.set(key, AudioStatus.Paused);
    audioElement?.pause();
  };

  return audioElement;
}

export function updateAudioEffect(
  ctx: CanvasRenderingContext2D,
  effect: AudioEffect,
  strip: Strip,
  scene: SceneState
) {
  const audioAsset = scene.assets.find(
    (asset) => asset.id === effect.audioAssetId
  );
  const elementMapKey = effect.id + effect.audioAssetId;
  const currentStatus = audioStatusMap.get(elementMapKey);
  let audioElement = loadedAudioElementMap.get(elementMapKey);
  if (currentStatus === AudioStatus.Deleted) {
    return;
  }
  if (
    scene.currentTime < strip.start ||
    scene.currentTime > strip.start + strip.length - 1 / scene.fps
  ) {
    audioStatusMap.set(effect.audioAssetId, AudioStatus.Paused);
    if (!audioElement) {
      return;
    }
    audioElement.pause();
    audioElement.currentTime = 0;
    return;
  }
  if (audioAsset) {
    if (!audioElement) {
      audioElement = createAudioElementOrGetFromCache(effect, audioAsset);
    }
    if (currentStatus === AudioStatus.Loading) {
      return;
    }
    audioElement.onseeked = () => {
      if (scene.isPlaying) {
        audioElement?.play();
        audioStatusMap.set(elementMapKey, AudioStatus.Playing);
      } else {
        audioElement?.pause();
        audioStatusMap.set(elementMapKey, AudioStatus.Paused);
      }
    };
    audioElement.onplay = () => {
      audioStatusMap.set(elementMapKey, AudioStatus.Playing);
    };
    audioElement.onpause = () => {
      audioStatusMap.set(elementMapKey, AudioStatus.Paused);
    };
    const gapFrames = 5;
    const target = scene.currentTime - strip.start + effect.offset;
    const diff = Math.abs(audioElement.currentTime - target);
    if (currentStatus === AudioStatus.Playing && !scene.isPlaying) {
      audioElement.pause();
    } else if (currentStatus === AudioStatus.Paused && scene.isPlaying) {
      audioElement.play();
    } else if (
      diff > (1 / scene.fps) * gapFrames &&
      currentStatus !== AudioStatus.Seeking
    ) {
      // should seek if audio currentTime is too far from scene currentTime
      audioElement.currentTime =
        scene.currentTime - strip.start + effect.offset;
      audioStatusMap.set(elementMapKey, AudioStatus.Seeking);
    } else if (currentStatus === AudioStatus.Seeking && modeLoadingBlack) {
    }
    const animatedVolume = calculateKeyFrameValue(
      effect.keyframes,
      scene.currentTime - strip.start,
      "volume",
      effect.volume,
      scene.fps
    );

    audioElement.volume = animatedVolume;
    if (currentStatus === AudioStatus.Seeking && scene.isPlaying) {
      return;
    }
  }
}

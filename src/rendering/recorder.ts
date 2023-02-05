import { isAudioEffect, isTextEffect, isVideoEffect } from "@/packages/vega-types";
import { SceneState } from "@/store/scene";

import {
  createAudioElementOrGetFromCache,
  getAudioElement,
} from "./updateAudioEffect";
import {
  isAudioAsset,
  isTextAsset,
  isVideoAsset,
  loadFont,
} from "./updateTextEffect";
import {
  createVideoElementOrGetFromCache,
  getVideoElement,
} from "./updateVideoEffect";

export function loadAllAssets(scene: SceneState) {
  const assets = scene.assets;
  const strips = scene.strips;
  strips.forEach((strip) => {
    strip.effects.forEach((effect) => {
      if (isVideoEffect(effect)) {
        const videoAsset = assets.find((a) => a.id === effect.videoAssetId);
        if (videoAsset && isVideoAsset(videoAsset)) {
          createVideoElementOrGetFromCache(effect, videoAsset);
        }
      }
      if (isAudioEffect(effect)) {
        const audioAsset = assets.find((a) => a.id === effect.audioAssetId);
        if (audioAsset && isAudioAsset(audioAsset)) {
          createAudioElementOrGetFromCache(effect, audioAsset);
        }
      }
      if (isTextEffect(effect)) {
        const fontAsset = assets.find((a) => a.id === effect.fontAssetId);
        if (fontAsset && isTextAsset(fontAsset)) {
          loadFont(fontAsset);
        }
      }
    });
  });
}

export class Recorder {
  data: Blob[] = [];
  audioNodes: AudioNode[] = [];
  audioCtx!: AudioContext;
  elNodeMap: WeakMap<HTMLMediaElement, AudioNode> = new WeakMap();

  recorder?: MediaRecorder;
  static main?: Recorder;

  stream?: MediaStream;
  dst!: MediaStreamAudioDestinationNode;

  isRecording() {
    return this.recorder?.state === "recording";
  }

  onEnd?: (blob: Blob) => void;

  constructor(private canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    Recorder.main = this;
  }

  start(scene: SceneState) {
    const strips = scene.strips;
    this.stream = this.canvas.captureStream();
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    if (!this.dst) {
      this.dst = this.audioCtx.createMediaStreamDestination();
    }

    this.recorder = new MediaRecorder(this.stream, {
      mimeType: "video/webm;codecs=vp9",
      audioBitsPerSecond: 16 * 1000,
    });

    strips.forEach((strip) => {
      strip.effects.forEach((effect) => {
        let mediaEl: HTMLMediaElement | null = null;
        if (isVideoEffect(effect)) {
          mediaEl = getVideoElement(effect);
        }
        if (isAudioEffect(effect)) {
          mediaEl = getAudioElement(effect);
        }
        if (!mediaEl) {
          return;
        }
        let node = this.elNodeMap.get(mediaEl);
        if (!node) {
          node = this.audioCtx?.createMediaElementSource(mediaEl);
        }
        node.connect(this.dst);
        this.audioNodes.push(node);
        this.elNodeMap.set(mediaEl, node);
        const ts = this.dst.stream.getAudioTracks();
        ts.forEach((t) => {
          this.stream?.addTrack(t);
        });
      });
    });

    this.recorder.addEventListener("stop", () => {
      this.onEnd?.(new Blob(this.data));
    });

    this.recorder.addEventListener("dataavailable", (ev) => {
      this.data.push(ev.data);
    });

    this.recorder.start(1000);
  }

  stop() {
    this.backAudio();
    this.recorder?.stop();
    this.dst?.disconnect();
    delete this.stream;
    delete this.recorder;
  }

  /**
   * back audio distination to speaker.
   */
  private backAudio() {
    this.audioNodes.forEach((node) => {
      node.connect(this.audioCtx.destination);
    });
    this.audioNodes = [];
  }
}

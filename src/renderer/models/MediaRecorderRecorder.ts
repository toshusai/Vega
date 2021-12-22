import { Camera, Scene, WebGLRenderer } from "three";
import { Strip } from "./strips";
import { VideoStrip } from ".";
import { PLAY_EVERY_FRAME, SYNC_TO_AUDIO } from "~/plugins/config";

/**
 * Record scene by MediaRecorder
 * fast and light but, not guaranteed quarity.
 */
export default class MediaRecorderRecorder {
  isRecording: boolean = false;
  canvas: HTMLCanvasElement;
  scene: Scene;
  camera: Camera;
  renderer: WebGLRenderer;
  strips: Strip[];
  time: number = 0;
  fps: number;
  currentFrame: number = 1;
  frames: number = 0;
  onProgress: (ratio: number) => void;
  onEnd: (blob: Blob) => void = () => {};

  // @ts-ignore
  recorder!: MediaRecorder;
  data: any[] = [];

  audioNodes: MediaElementAudioSourceNode[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    scene: Scene,
    camera: Camera,
    renderer: WebGLRenderer,
    fps: number,
    frames: number,
    strips: Strip[],
    onProgress: (ratio: number) => void,
    onEnd: (blob: Blob) => void
  ) {
    this.camera = camera;
    this.canvas = canvas;
    this.scene = scene;
    this.fps = fps;
    this.renderer = renderer;
    this.frames = frames;
    this.strips = strips;
    this.onProgress = onProgress;
    this.onEnd = onEnd;
  }

  async start() {
    this.isRecording = true;
    const audioCtx = new AudioContext();
    // @ts-ignore
    const stream = this.canvas.captureStream();
    const dst = audioCtx.createMediaStreamDestination();
    this.strips.forEach((s) => {
      if (s instanceof VideoStrip) {
        const node = audioCtx.createMediaElementSource(s.video);
        node.connect(dst);
        this.audioNodes.push(node);
        const ts = dst.stream.getAudioTracks();
        ts.forEach((t) => {
          stream.addTrack(t);
        });
      }
    });
    // @ts-ignore
    this.recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp8",
      audioBitsPerSecond: 16 * 1000,
    });
    this.recorder.ondataavailable = (d: any) => {
      this.data.push(d.data);
    };
    this.recorder.start();

    await this.update(0);
  }

  async update(_time: number) {
    if (!this.isRecording) return;
    for (let i = 0; i < this.strips.length; i++) {
      const s = this.strips[i];
      await s.update(this.time, 1000 / this.fps, true, SYNC_TO_AUDIO, this.fps);
    }
    this.renderer.render(this.scene, this.camera);
    this.onProgress(this.currentFrame / this.frames);
    this.time += 1 / this.fps;
    this.currentFrame++;
    if (this.currentFrame <= this.frames) {
      window.requestAnimationFrame((v) => this.update(v));
    } else {
      this.end();
    }
  }

  async stopStrips() {
    for (let i = 0; i < this.strips.length; i++) {
      const s = this.strips[i];
      await s.update(0, 1000 / this.fps, false, PLAY_EVERY_FRAME, this.fps);
    }
  }

  end() {
    this.backAudio();
    this.recorder.addEventListener("stop", () => {
      this.onEnd(new Blob(this.data));
    });
    this.recorder.stop();
  }

  /**
   * back audio distination to speaker.
   */
  private backAudio() {
    const ctx = new AudioContext();
    this.audioNodes.forEach((node) => {
      node.connect(ctx.destination);
    });
  }

  async cancel() {
    this.backAudio();
    await this.stopStrips();
    if (this.recorder.state == "recording") {
      this.recorder.stop();
    }
    this.isRecording = false;
  }
}

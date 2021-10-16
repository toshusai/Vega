import { Camera, Scene, WebGLRenderer } from "three";
import { Strip } from "./strips";
import { PLAY_EVERY_FRAME } from "~/plugins/config";

export default class Recorder {
  isRecording: boolean = false;
  canvas: HTMLCanvasElement;
  scene: Scene;
  camera: Camera;
  renderer: WebGLRenderer;
  capturer: CCapture | null = null;
  strips: Strip[];
  time: number = 0;
  fps: number;
  currentFrame: number = 1;
  frames: number = 0;
  onProgress: (ratio: number) => void;
  onEnd: (data: Uint8Array) => void = () => {};

  constructor(
    canvas: HTMLCanvasElement,
    scene: Scene,
    camera: Camera,
    renderer: WebGLRenderer,
    fps: number,
    frames: number,
    strips: Strip[],
    onProgress: (ratio: number) => void,
    onEnd: (data: Uint8Array) => void
  ) {
    this.camera = camera;
    this.canvas = canvas;
    this.scene = scene;
    this.fps = fps;
    this.renderer = renderer;
    this.frames = frames;
    this.strips = strips;
    this.capturer = new CCapture({ format: "webm" });
    this.onProgress = onProgress;
    this.onEnd = onEnd;
  }

  async start() {
    this.isRecording = true;
    this.capturer?.start();
    await this.update(0);
  }

  async update(_time: number) {
    if (!this.isRecording) return;
    for (let i = 0; i < this.strips.length; i++) {
      const s = this.strips[i];
      await s.update(
        this.time,
        1000 / this.fps,
        true,
        PLAY_EVERY_FRAME,
        this.fps
      );
    }
    this.renderer.render(this.scene, this.camera);
    this.capturer?.capture(this.canvas);
    this.onProgress(this.currentFrame / this.frames);
    this.time += 1 / this.fps;
    this.currentFrame++;
    if (this.currentFrame <= this.frames) {
      window.requestAnimationFrame((v) => this.update(v));
    } else {
      await this.end();
    }
  }

  async stopStrips() {
    for (let i = 0; i < this.strips.length; i++) {
      const s = this.strips[i];
      await s.update(0, 1000 / this.fps, false, PLAY_EVERY_FRAME, this.fps);
    }
  }

  async end() {
    await this.stopStrips();
    const data = await this.writeWebm();
    this.isRecording = false;
    this.onEnd(data);
  }

  async cancel() {
    await this.stopStrips();
    this.capturer?.stop();
    this.isRecording = false;
  }

  private writeWebm() {
    return new Promise<Uint8Array>((resolve, reject) => {
      this.capturer?.stop();
      this.capturer?.save(async (blob: Blob) => {
        try {
          const fileData = new Uint8Array(await blob.arrayBuffer());
          resolve(fileData);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}

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
  audioCtx: AudioContext = new AudioContext();
  elNodeMap: WeakMap<HTMLMediaElement, AudioNode> = new WeakMap();

  // @ts-ignore
  recorder!: MediaRecorder;
  data: any[] = [];

  audioNodes: AudioNode[] = [];

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
    this.time = 0;
    this.currentFrame = 0;
    this.isRecording = true;
    // @ts-ignore
    const stream = this.canvas.captureStream();
    const dst = this.audioCtx.createMediaStreamDestination();

    this.audioNodes = [];
    this.strips.forEach((s) => {
      if (s instanceof VideoStrip) {
        let node = this.elNodeMap.get(s.video);
        if (!node) {
          node = this.audioCtx.createMediaElementSource(s.video);
        }
        node.connect(dst);
        node.connect(this.audioCtx.destination);
        this.audioNodes.push(node);
        this.elNodeMap.set(s.video, node);
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
    this.stopStrips();
  }

  /**
   * back audio distination to speaker.
   */
  private backAudio() {
    this.audioNodes.forEach((node) => {
      node.connect(this.audioCtx.destination);
    });
  }

  async cancel() {
    this.backAudio();
    if (this.recorder.state == "recording") {
      this.recorder.stop();
    }
    this.isRecording = false;
    await this.stopStrips();
  }
}

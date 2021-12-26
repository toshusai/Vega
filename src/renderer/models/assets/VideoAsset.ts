import WaveSufer from "wavesurfer.js";
import { Asset, IAsset } from "./Asset";

export type IVideoAsset = IAsset;

const supportTypes = ["video/mp4", "video/webm", "video/quicktime"];

export class VideoAsset extends Asset implements IVideoAsset {
  type: string = "Video";
  valid: boolean = false;
  audioWave: any;
  waveContainer: HTMLElement;
  wave?: WaveSufer;
  videoEl?: HTMLVideoElement;
  waveCanvass?: NodeListOf<HTMLCanvasElement>;

  maxCanvasWidth: number = 4000;

  constructor(id: string, name: string, path: string) {
    super(id, name, path);
    this.waveContainer = document.createElement("div");
    this.videoEl = document.createElement("video");
    this.waveContainer.style.width = "100%";
    this.waveContainer.style.position = "absolute";
    this.waveContainer.style.top = "0";
    this.waveContainer.style.left = "0";
    this.waveContainer.style.left = "0";
    this.videoEl.src = path;
    this.videoEl.onloadedmetadata = () => {
      if (this.videoEl) {
        this.wave = WaveSufer.create({
          container: this.waveContainer,
          height: 13,
          waveColor: "#ff9800",
          interact: false,
          progressColor: "#ff9800",
          maxCanvasWidth: this.maxCanvasWidth,
        });
        this.wave.zoom(10);
        this.wave?.load(this.videoEl);
        this.watch();
      }
    };
    this.videoEl.load();
  }

  watch() {
    if (!this.waveContainer) return;
    this.waveCanvass = this.waveContainer.querySelectorAll(
      "canvas"
    ) as NodeListOf<HTMLCanvasElement>;

    if (this.waveCanvass.length < 2)
      window.requestAnimationFrame(() => this.watch());
  }

  getcanvas(srcX: number) {
    const i = Math.floor(srcX / this.maxCanvasWidth);
    return this.waveCanvass?.item(i);
  }

  getSrcX(srcX: number) {
    const i = Math.floor(srcX / this.maxCanvasWidth);
    return srcX - i * this.maxCanvasWidth;
  }

  public static isSupportType(type: string) {
    return supportTypes.includes(type);
  }
}

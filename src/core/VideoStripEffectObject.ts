import * as T from "three";
import { Vector3 } from "three";
import { IAsset } from "./IAsset";
import { Strip } from "./Strip";
import { VideoStripEffect } from "./VideoStripEffect";

const FPS_ERROR_TOLERANCE = 0.01;
const ASSET_SEEK_TIMEOUT_MS = 10000;

export class VideoStripEffectObject {
  type = "Video";

  loaded = false;

  videoOffset = 0;

  video!: HTMLVideoElement;
  canvas?: HTMLCanvasElement;
  obj!: T.Mesh;
  ctx?: CanvasRenderingContext2D | null;
  tex?: T.VideoTexture;

  videoDuration = 0;

  event: EventTarget = new EventTarget();

  inProgress = false;

  get src() {
    return this.video.src;
  }

  constructor(iface: VideoStripEffect) {
    this.video = document.createElement("video");

    this.video.controls = true;
    // document.body.append(this.video);
    this.loaded = true;

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) throw new Error("context2d error");
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.tex = new T.VideoTexture(this.video);
    this.tex.minFilter = T.LinearFilter;
    this.tex.magFilter = T.LinearFilter;

    const mat = new T.MeshBasicMaterial({
      map: this.tex,
      side: T.DoubleSide,
    });
    const movieGeometry = new T.PlaneGeometry(
      this.canvas.width,
      this.canvas.height
    );
    this.obj = new T.Mesh(movieGeometry, mat);
    if (iface.id) {
      this.obj.uuid = iface.id;
    }
    // this.video.src = "/BigBuckBunny.mp4";
    this.updateAsset("/BigBuckBunny.mp4");
  }

  public updateAsset(src: string) {
    this.loaded = false;
    const onLoad = () => {
      if (!this.canvas) return;
      if (this.loaded) return;
      this.videoDuration = this.video.duration;
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;

      this.obj.geometry = new T.PlaneGeometry(
        this.canvas.width,
        this.canvas.height
      );
      this.loaded = true;
      this.event.dispatchEvent(new CustomEvent("update"));
    };
    this.video.onloadedmetadata = () => onLoad();
    this.video.src = src;
    this.video.load();
  }

  public async update(
    strip: Strip,
    effect: VideoStripEffect,
    time: number,
    isPlay: boolean,
    jump: boolean
  ) {
    if (this.tex) this.tex.needsUpdate = true;
    if (this.ctx && this.video) this.ctx.drawImage(this.video, 0, 0);

    this.obj.position.copy(
      new Vector3(effect.position.x, effect.position.y, strip.layer)
    );

    if (!this.loaded) {
      this.obj.visible = false;
      return;
    }

    if (strip.start < time && time < strip.start + strip.length) {
      this.obj.visible = true;
      this.video.volume = 1;

      if ((isPlay && this.video.paused) || jump) {
        if (!this.inProgress) {
          this.inProgress = true;
          this.video.play().then(() => {
            this.inProgress = false;
          });
          this.video.currentTime = time - strip.start + this.videoOffset;
        }
      }
      if (!isPlay && !this.inProgress) {
        this.video.pause();
      }
    } else {
      this.video.volume = 0;
      if (!this.video.paused && !this.inProgress) {
        this.video.pause();
      }
      this.obj.visible = false;
    }
  }
}

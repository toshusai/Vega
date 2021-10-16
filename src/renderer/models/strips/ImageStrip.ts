import * as T from "three";
import { MeshBasicMaterial, PlaneBufferGeometry } from "three";
import { ImageAsset } from "../assets";
import { IVector3 } from "../math/Vector3";
import { IStrip, Strip } from "./Strip";
import { PlayMode } from "~/plugins/config";

export type IImageStrip = IStrip & {
  id?: string;
  start?: number;
  length?: number;
  position: IVector3;
  layer?: number;
  type?: string;
  src: string;
  readonly assetId: string;
};

export class ImageStrip extends Strip {
  position: T.Vector3 = new T.Vector3(0, 0, 0);
  type: string = "Image";

  videoOffset: number = 0;

  obj!: T.Mesh;
  tex?: T.Texture;

  playRequests: number[] = [];
  videoDuration: number = 0;

  event: EventTarget = new EventTarget();

  /**
   * quad plane geometry that forward -Z.
   * size is 1x1.
   */
  geometry!: PlaneBufferGeometry;

  /**
   * material
   */
  material!: MeshBasicMaterial;

  readonly imageAsset?: ImageAsset;

  get width() {
    return this.tex?.image ? this.tex.image.width : 0;
  }

  get height() {
    return this.tex?.image ? this.tex.image.height : 0;
  }

  constructor(iface: IImageStrip, imageAsset?: ImageAsset) {
    super();
    this.imageAsset = imageAsset;
    this.position = new T.Vector3(
      iface.position.x,
      iface.position.y,
      iface.position.z
    );
    if (iface.length) this.length = iface.length;
    if (iface.layer) this.layer = iface.layer;
    if (iface.start) this.start = iface.start;

    if (imageAsset) {
      this.tex = new T.TextureLoader().load(imageAsset?.path, () => {
        if (this.obj) {
          this.obj.scale.set(this.tex?.image.width, this.tex?.image.height, 1);
        }
      });
      this.tex.minFilter = T.LinearFilter;
      this.tex.magFilter = T.LinearFilter;
    }
    this.material = new T.MeshBasicMaterial({
      map: this.tex,
    });
    this.geometry = new PlaneBufferGeometry(1, 1, 1, 1);
    this.obj = new T.Mesh(this.geometry, this.material);
    if (iface.id) {
      this.obj.uuid = iface.id;
    }

    this.id = this.obj.uuid;
    this.obj.position.set(this.position.x, this.position.y, this.position.z);
  }

  public toInterface(): IImageStrip {
    return {
      id: this.id,
      length: this.length,
      position: {
        x: this.position.x,
        y: this.position.y,
        z: this.position.z,
      },
      start: this.start,
      type: this.type,
      layer: this.layer,
      src: this.imageAsset?.path || "",
      assetId: this.imageAsset?.id || "",
    };
  }

  updateAsset(imageAsset: ImageAsset) {
    this.tex?.dispose();
    this.tex = new T.TextureLoader().load(imageAsset?.path, () => {
      if (this.obj) {
        this.obj.scale.set(this.tex?.image.width, this.tex?.image.height, 1);
      }
      if (!this.tex) return;
      this.tex.needsUpdate = true;
    });
    this.tex.minFilter = T.LinearFilter;
    this.tex.magFilter = T.LinearFilter;
    this.material.map = this.tex;
  }

  public async update(
    time: number,
    _delta: number,
    _isPlay: boolean,
    _playMode: PlayMode,
    _fps: number
  ) {
    this.obj.position.set(this.position.x, this.position.y, this.position.z);
    this.obj.position.setZ(this.layer);

    if (this.start < time && time < this.end) {
      this.obj.visible = true;
    } else {
      this.obj.visible = false;
    }
    // Use await for """Async method 'update' has no 'await' expression""" (require-await)
    return await new Promise<void>((resolve, reject) => {
      try {
        return resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}

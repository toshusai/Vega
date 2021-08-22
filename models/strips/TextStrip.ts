import * as T from "three";
import { FontAsset } from "../assets";
import { IVector3 } from "../math/Vector3";
import { Strip } from "./Strip";
import { PlayMode } from "~/plugins/config";

export interface ITextStrip {
  id: string;
  start: number;
  length: number;
  layer: number;
  text: string;
  fontSize: number;
  color: string;
  position: IVector3;
  fontAssetId: string;
  type: string;
}

export class TextStrip extends Strip implements ITextStrip {
  public static defaultFont: T.Font;
  text: string = "";
  fontSize: number = 100;
  color: string = "ffffff";
  position: T.Vector3 = new T.Vector3(0, 0, 0);
  obj!: T.Mesh;
  fontAssetId: string = FontAsset.defaultFont.id;
  fontAsset: FontAsset = FontAsset.defaultFont;
  type: string = "Text";
  font!: T.Font;

  prevText: string = "";

  public static create(iface: ITextStrip, font: T.Font) {
    const text = new TextStrip(font);
    text.color = iface.color;
    if (iface.fontAssetId) text.fontAssetId = iface.fontAssetId;

    text.fontSize = iface.fontSize;
    text.length = iface.length;
    text.position = new T.Vector3(
      iface.position.x,
      iface.position.y,
      iface.position.z
    );
    text.start = iface.start;
    text.text = iface.text;
    text.type = iface.type;
    text.id = iface.id;
    text.layer = iface.layer;
    text.obj.uuid = iface.id;

    return text;
  }

  public toInterface(): ITextStrip {
    return {
      id: this.id,
      color: this.color,
      fontAssetId: this.fontAssetId,
      fontSize: this.fontSize,
      length: this.length,
      position: {
        x: this.position.x,
        y: this.position.y,
        z: this.position.z,
      },
      start: this.start,
      text: this.text,
      type: this.type,
      layer: this.layer,
    };
  }

  constructor(font: T.Font) {
    super();
    this.font = font;
    this.obj = new T.Mesh(this.getGeometory(), this.getMaterial());
    this.id = this.obj.uuid;
  }

  getGeometory() {
    return new T.TextGeometry(this.text, {
      font: this.font,
      size: this.fontSize,
    });
  }

  getMaterial() {
    return new T.MeshBasicMaterial({
      color: Number.parseInt(this.color, 16),
      side: T.DoubleSide,
    });
  }

  public async update(
    _time: number,
    _delta: number,
    _isPlay: boolean,
    _playMode: PlayMode,
    _fps: number
  ) {
    this.obj.position.set(this.position.x, this.position.y, this.position.z);
    if (this.prevText != this.text) this.obj.geometry = this.getGeometory();
    this.obj.position.setZ(this.layer);
    this.prevText = this.text;

    if (this.start < _time && _time < this.end) {
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

import * as T from "three";
import {
  AddEquation,
  CanvasTexture,
  CustomBlending,
  MeshBasicMaterial,
  OneFactor,
  OneMinusSrcAlphaFactor,
  PlaneBufferGeometry,
} from "three";
import { IVector3 } from "../math/Vector3";
import { Strip } from "./Strip";
import { PlayMode } from "~/plugins/config";

/**
 * TextStrip structure used by saved data.
 * It can be converted in both directions with JSON.
 */
export interface ITextStrip {
  id: string;
  start: number;
  length: number;
  layer: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  position: IVector3;
  type: string;
}

/**
 * The strip of text.
 */
export class TextStrip extends Strip implements ITextStrip {
  /**
   * The string of "Strip" kind.
   * Do not overwrite basically.
   */
  type: string = "Text";

  /**
   * The text to show.
   */
  text: string = "";

  /**
   * Font size. 1px is 1px of the rendering screen.
   */
  fontSize: number = 100;

  /**
   * The font family name.
   */
  fontFamily = "serif";

  /**
   * The color of text. Format is css style ().
   */
  color: string = "#ffffff";

  /**
   * The position of text.
   */
  position: T.Vector3 = new T.Vector3(0, 0, 0);

  /**
   * The object to render in three.js.
   * Display size is controlled by this Object3D scale.
   * Note geometry is always 1x1
   */
  obj!: T.Mesh;

  /**
   * The texture to show on quad.
   */
  texture!: CanvasTexture;

  /**
   * The canvas used by texture.
   */
  canvas!: HTMLCanvasElement;

  /**
   * The context for drawing canvas.
   */
  ctx!: CanvasRenderingContext2D;

  /**
   * quad plane geometry that forward -Z.
   * size is 1x1.
   */
  geometry!: PlaneBufferGeometry;

  /**
   * material
   */
  material!: MeshBasicMaterial;

  /**
   * Create new TextStrip
   * @param itext The text strip interface.
   */
  constructor(itext: ITextStrip) {
    super();
    this.text = itext.text;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.texture = new CanvasTexture(this.canvas);
    this.texture.needsUpdate = true;
    this.texture.premultiplyAlpha = true;
    this.material = new MeshBasicMaterial({
      map: this.texture,
      // for transparent background
      transparent: true,
      depthTest: true,
      depthWrite: false,
      opacity: 1,
      blending: CustomBlending,
      blendSrc: OneFactor,
      blendDst: OneMinusSrcAlphaFactor,
      blendEquation: AddEquation,
    });
    this.geometry = new PlaneBufferGeometry(1, 1, 1, 1);
    this.obj = new T.Mesh(this.geometry, this.material);
    this.obj.uuid = itext.id;
    this.position.setX(itext.position.x);
    this.position.setY(itext.position.y);
    this.position.setZ(itext.position.z);
    this.start = itext.start;
    this.length = itext.length;
    this.layer = itext.layer;
    this.id = this.obj.uuid;

    this.updateFont();
    this.draw();
  }

  /**
   * Calculates the actual font height by adding the DOM.
   * Note that this method actually adds a dom.
   */
  updateFont() {
    const span = document.createElement("span");
    span.innerHTML = this.text;
    span.style.fontFamily = this.fontFamily;
    span.style.fontSize = this.fontSize + "px";
    span.style.whiteSpace = "nowrap";
    document.body.append(span);
    const r = span.getBoundingClientRect();
    this.canvas.height = r.height;
    span.remove();
  }

  /**
   * Draw text to canvas by ctx.fillText.
   */
  draw() {
    this.ctx.font = `${this.fontSize}px '${this.fontFamily}'`;
    const metrics = this.ctx.measureText(this.text);
    this.canvas.width = metrics.width;

    this.obj.scale.set(this.canvas.width, this.canvas.height, 1);

    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "bottom";
    this.ctx.fillStyle = this.color;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillText(this.text, 0, this.canvas.height);
    this.texture.needsUpdate = true;
  }

  /**
   * convert to ITextStrip.
   * @returns The interface.
   */
  public toInterface(): ITextStrip {
    return {
      id: this.id,
      color: this.color,
      fontFamily: this.fontFamily,
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

  /**
   * Inheritance method that updates the appearance.
   * Basically should call before rendering.
   * @param time The current time of video.
   * @param _delta Not used.
   * @param _isPlay Not used.
   * @param _playMode Not used.
   * @param _fps Not used.
   * @returns void
   */
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
      this.draw();
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

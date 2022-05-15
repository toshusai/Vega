import * as THREE from "three";
import { EffectObject } from "./EffectObject";
import { TextStripEffect } from "./TextStripEffect";
import { Strip } from "./Strip";

export class TextStripEffectObject extends EffectObject {
  id: string;
  obj?: THREE.Mesh;
  texture?: THREE.CanvasTexture;
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  geometry?: THREE.PlaneBufferGeometry;
  material?: THREE.MeshBasicMaterial;

  text: string;
  color: string;

  fontFamily = "serif";
  /**
   * Font size. 1px is 1px of the rendering screen.
   */
  fontSize = 100;

  fontStyle = "normal";

  /**
   * 計算したテキストの幅
   */
  mesureWidth = 0;

  constructor(itext: TextStripEffect) {
    super();
    this.text = itext.text;
    this.color = itext.color;
    this.fontSize = itext.size;
    // this.fontFamily = itext.fontFamily;
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1024;
    this.canvas.height = 1024;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.needsUpdate = true;
    this.texture.premultiplyAlpha = true;
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      // for transparent background
      transparent: true,
      depthTest: true,
      depthWrite: false,
      opacity: 1,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      blendEquation: THREE.AddEquation,
    });
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    this.obj = new THREE.Mesh(this.geometry, this.material);
    this.obj.uuid = itext.id;
    this.obj.position.setX(itext.position.x);
    this.obj.position.setY(itext.position.y);
    // this.obj.rotateY(Math.PI);
    this.obj.position.setZ(itext.position.z);

    // this.outlineColor = itext.outlineColor;
    // this.outlineSize = itext.outlineSize;
    // this.shadowBlur = itext.shadowBlur;
    // this.shadowColor = itext.shadowColor;
    this.updateFont();
  }

  updateFont() {
    const span = document.createElement("span");
    span.innerHTML = this.text;
    span.style.fontFamily = this.fontFamily;
    span.style.fontSize = this.fontSize + "px";
    span.style.fontStyle = this.fontStyle;
    span.style.whiteSpace = "nowrap";
    document.body.append(span);
    const r = span.getBoundingClientRect();
    this.canvas.height = r.height;

    span.remove();
  }

  /**
   * Draw text to canvas by ctx.fillText.
   */
  draw(itext: TextStripEffect) {
    // const font =
    // this.updateFont();
    this.ctx.font = `${this.fontStyle} ${this.fontSize}px ${this.fontFamily}`;
    const metrics = this.ctx.measureText(itext.text);
    this.mesureWidth = metrics.width;
    // this.canvas.width = metrics.width;
    // console.log(metrics.width, this.canvas.width, this.canvas.height);

    // this.canvas.height = 128; //this.canvas.width;
    this.obj.scale.set(this.canvas.width, this.canvas.height, 1);

    // this.ctx.font = `${this.fontStyle} ${this.fontSize}px ${this.fontFamily}`;
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "bottom";

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // this.ctx.shadowColor = this.shadowColor;
    // this.ctx.shadowBlur = this.shadowBlur;
    // this.ctx.strokeStyle = this.outlineColor;
    // this.ctx.lineWidth = this.outlineSize;
    // this.ctx.strokeText(itext.text, 0, this.canvas.height);
    // this.ctx.shadowBlur = 0;

    this.ctx.fillStyle = this.color;
    // this.ctx.fillRect(0, 0, 10000, 10000);
    this.ctx.fillText(
      itext.text,
      this.canvas.width / 2 - metrics.width / 2,
      this.canvas.height
    );
    this.texture.needsUpdate = true;
  }

  public async update(strip: Strip, itext: TextStripEffect, time: number) {
    this.obj.position.set(itext.position.x, itext.position.y, strip.layer);

    if (strip.start < time && time < strip.start + strip.length) {
      this.obj.visible = true;
      this.draw(itext);
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

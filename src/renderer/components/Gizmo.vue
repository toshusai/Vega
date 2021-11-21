<template>
  <div v-show="visible" ref="gizmo" class="frame" :style="style"></div>
</template>

<style scoped>
.frame {
  border: 2px solid var(--sp-blue-400);
  cursor: move;
  position: absolute;
  box-sizing: content-box;
  transform: translate(-1px, -1px);
  padding: 1px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref } from "vue-property-decorator";
import * as THREE from "three";
import {
  ImageStrip,
  Strip,
  Text3DStrip,
  TextStrip,
  VideoStrip,
} from "~/models";
import { addDragEventOnce, LEFT } from "~/plugins/mouse";
import { IVector3 } from "~/models/math/Vector3";

@Component({})
export default class Gizmo extends Vue {
  @Prop() x!: number;
  @Prop() y!: number;
  @Prop() width!: number;
  @Prop() height!: number;
  @Prop() strip!: Strip;
  @Prop({ default: 0.2 }) scale!: number;

  @Ref() gizmo?: HTMLElement;

  style: Partial<CSSStyleDeclaration> = {};

  get visible() {
    return this.canDrawStrip(this.strip);
  }

  get ratio() {
    const rect = this.$el.parentElement?.getBoundingClientRect();
    if (!rect) return 1;
    return (rect.width / this.width) * this.scale;
  }

  get ratioH() {
    const rect = this.$el.parentElement?.getBoundingClientRect();
    if (!rect) return 1;
    return (rect.height / this.height) * this.scale;
  }

  /**
   * Check the strip can draw gizmo.
   * @param strip The target to check.
   */
  canDrawStrip(
    strip: Strip
  ): strip is VideoStrip | TextStrip | Text3DStrip | ImageStrip {
    return (
      strip instanceof VideoStrip ||
      strip instanceof Text3DStrip ||
      strip instanceof TextStrip ||
      strip instanceof ImageStrip
    );
  }

  changeStripPosEmit(vec: IVector3) {
    this.$emit("changeStripPos", vec);
  }

  mounted() {
    if (this.gizmo) {
      this.gizmo.addEventListener("mousedown", (e) => {
        if (e.button != LEFT) return;
        addDragEventOnce((e) => {
          if (e.button != LEFT) return;
          if (this.canDrawStrip(this.strip)) {
            const iface = this.strip.toInterface();
            const x = iface.position.x + e.movementX / this.scale;
            const y = iface.position.y - e.movementY / this.scale;
            this.changeStripPosEmit({ x, y, z: iface.position.z });
          }
        });
      });
    }
  }

  getStyle(): Partial<CSSStyleDeclaration> {
    if (this.canDrawStrip(this.strip)) {
      const px = this.strip.position.x;
      const py = this.height - this.strip.position.y;

      let width;
      let height;
      let top;
      let left;

      top = py * this.scale;
      left = px * this.scale;

      const rect =
        this.$el.parentElement?.parentElement?.getBoundingClientRect();
      if (!rect) return {};

      if (this.strip instanceof VideoStrip) {
        width = this.strip.video.videoWidth * this.scale;
        height = this.strip.video.videoHeight * this.scale;
        top = py * this.scale - height / 2 - 1; // for content-box
        left = px * this.scale - width / 2 - 1;
      } else if (this.strip instanceof Text3DStrip) {
        const box = new THREE.Box3().setFromObject(this.strip.obj);
        const r = new THREE.Vector3();
        box.getSize(r);
        top = py * this.scale;
        left = px * this.scale;
        width = r.x * this.scale;
        height = r.y * this.scale;
        top -= height;
      } else if (this.strip instanceof TextStrip) {
        width = this.strip.canvas.width * this.scale;
        height = this.strip.canvas.height * this.scale;
        top = py * this.scale - height / 2;
        left = px * this.scale - width / 2;
      } else if (this.strip instanceof ImageStrip) {
        width = this.strip.width * this.scale;
        height = this.strip.height * this.scale;
        top = py * this.scale - height / 2;
        left = px * this.scale - width / 2;
      }

      return {
        top: top + "px",
        left: left + "px",
        width: width + "px",
        height: height + "px",
      };
    }
    return {};
  }

  update() {
    this.style = this.getStyle();
  }
}
</script>
<template>
  <div class="root">
    <WindowNameTag name="Preview" />
    <div ref="preview" class="preview-window">
      <div class="canvas" :style="canvasContainerStyle">
        <canvas ref="renderCanvas" class="render-canvas" />
        <Gizmo
          ref="gizmo"
          :strip="selectedStrip"
          :width="width"
          :height="height"
          :scale="scale"
          @changeStripPos="changeStripPos"
        />
      </div>
      <div class="info">
        <div>TIME:{{ timeFormat }}</div>
        <div :class="fpsClass">FPS : {{ previewFps }}</div>
        <div>
          RES :
          <VegaSelect
            style="width: auto"
            :value="previewScale"
            :items="scaleItems"
            @change="changePreviewScale"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.root {
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--black);
}

.preview-window {
  position: relative;
  background-color: #000;
  display: flex;
  box-sizing: border-box;
  /* -20px for WindowNameTag */
  /* WARN maybe cause unexpected style */
  height: calc(100% - 20px);
}

.render-canvas {
  box-sizing: border-box;
  transform-origin: left top;
}

.canvas {
  border: 1px solid var(--white);
  position: relative;
  margin: auto;
  box-sizing: content-box;
}

.info {
  position: absolute;
  left: 0;
  top: 0;
}

.fps-warn {
  color: red;
}
</style>

<script lang="ts">
import Vue from "vue";
import * as T from "three";
import { Component, Prop, Ref } from "vue-property-decorator";
import { OptionKeyValue } from "./vega/VegaSelect.vue";
import WindowNameTag from "~/components/vega/WindowNameTag.vue";
import Gizmo from "~/components/Gizmo.vue";
import { Strip } from "~/models";
import { IVector3 } from "~/models/math/Vector3";

const FPS_UPDATE_INTERVAL = 1000;

@Component({
  components: {
    WindowNameTag,
    Gizmo,
  },
})
export default class PreviewWindow extends Vue {
  @Prop({ default: 0 }) currentTime!: number;
  @Prop() selectedStrip!: Strip;
  @Prop({ default: 60 }) fps!: number;
  @Prop() width!: number;
  @Prop() height!: number;

  @Ref() renderCanvas?: HTMLCanvasElement;
  @Ref() gizmo?: Gizmo;
  @Ref() preview?: HTMLElement;

  scaleItems: OptionKeyValue[] = [
    {
      value: 1,
      text: "Full",
    },
    {
      value: 1 / 2,
      text: "1/2",
    },
    {
      value: 1 / 4,
      text: "1/4",
    },
    {
      value: 1 / 8,
      text: "1/8",
    },
    {
      value: 1 / 16,
      text: "1/16",
    },
  ];

  renderer: T.WebGLRenderer | null = null;
  canvas?: HTMLCanvasElement;
  begin: number = Date.now();
  prev: number = Date.now();
  previewFps: number = 0;
  frames: number = 0;
  prevRect?: DOMRect;
  scale: number = 0.2;
  previewScale: number = 1;

  get valid() {
    return this.previewFps >= this.fps;
  }

  get timeFormat() {
    let s = this.currentTime;
    if (this.currentTime < 0) {
      s = -s;
    }
    const sec = s.toFixed(4);
    const ms = sec.substr(sec.length - 4, 4);
    const hhmmss = new Date(s * 1000).toISOString().substr(11, 8);

    let sign = " ";
    if (this.currentTime < 0) sign = "-";
    return `${sign}${hhmmss}.${ms}`;
  }

  get fpsClass() {
    if (this.valid) {
      return "";
    } else {
      return "fps-warn";
    }
  }

  get canvasContainerStyle(): Partial<CSSStyleDeclaration> {
    return {
      // +2 for border
      width: this.width * this.scale + 2 + "px",
      height: this.height * this.scale + 2 + "px",
    };
  }

  mounted() {
    this.renderer = new T.WebGLRenderer({
      canvas: this.renderCanvas,
    });
    window.addEventListener("resize", this.resize);
    this.canvas = this.renderCanvas;
  }

  changePreviewScale(v: OptionKeyValue) {
    this.previewScale = v.value as number;
    this.resize();
  }

  renderPreview(scene: T.Scene, camera: T.Camera) {
    this.renderer?.render(scene, camera);
    this.gizmo?.update();
    if (this.preview) {
      const rect = this.preview.getBoundingClientRect();
      if (this.prevRect) {
        if (this.prevRect.height != rect.height) {
          this.resize();
        }
      } else {
        this.resize();
      }
      this.prevRect = rect;
    }
  }

  start() {
    this.begin = Date.now();
  }

  end() {
    const now = Date.now();
    this.frames++;
    if (now >= this.prev + FPS_UPDATE_INTERVAL) {
      this.previewFps = Math.round((this.frames * 1000) / (now - this.prev));
      this.prev = now;
      this.frames = 0;
    }
  }

  changeStripPos(pos: IVector3) {
    this.$emit("changeStripPos", pos);
  }

  resize() {
    this.renderer?.setSize(
      this.width * this.previewScale,
      this.height * this.previewScale
    );
    if (!this.renderCanvas) return;
    const transform = `scale(${this.scale / this.previewScale})`;
    this.renderCanvas.style.transform = transform;
  }

  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  }
}
</script>

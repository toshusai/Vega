<template>
  <div data-vega-preview-window class="root">
    <div
      ref="preview"
      class="preview-window"
      @mousewheel="onWheel"
      @mousedown="down"
      @contextmenu="stop"
    >
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
    </div>
    <div class="info">
      <div>{{ timeFormat }}</div>
      <!-- <div style="height: 24px" :class="fpsClass">FPS : {{ previewFps }}</div> -->
      <VegaSelect
        style="width: auto; margin-left: auto; margin-right: 8px"
        :value="previewScale"
        :items="scaleItems"
        @change="changePreviewScale"
      />
    </div>
  </div>
</template>

<style scoped>
.root {
  height: 100%;
  overflow: hidden;
}

.preview-window {
  position: relative;
  background-color: #000;
  display: flex;
  box-sizing: border-box;
  height: 100%;
}

.render-canvas {
  box-sizing: border-box;
  transform-origin: left top;
}

.canvas {
  border: 1px solid var(--white);
  position: relative;
  box-sizing: content-box;
}

.info {
  position: relative;
  width: calc(100% - 8px);
  display: flex;
  font-family: Ricty;
  left: 8px;
  bottom: 32px;
}

.fps-warn {
  color: red;
}
</style>

<script lang="ts">
import Vue from "vue";
import * as T from "three";
import { Component, Prop, Ref, Watch } from "vue-property-decorator";
import { OptionKeyValue } from "./vega/VegaSelect.vue";
import WindowNameTag from "~/components/vega/WindowNameTag.vue";
import Gizmo from "~/components/Gizmo.vue";
import { Strip } from "~/models";
import { IVector3 } from "~/models/math/Vector3";
import VegaSelect from "~/components/vega/VegaSelect.vue";
import { addDragEventOnce } from "~/plugins/mouse";

const FPS_UPDATE_INTERVAL = 1000;

@Component({
  components: {
    WindowNameTag,
    VegaSelect,
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
  scale: number = 0.3;
  wheelScale: number = 0.0001;
  previewScale: number = 1;
  top: number = 32;
  left: number = 32;

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

    let sign = "";
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
      top: this.top + "px",
      left: this.left + "px",
    };
  }

  mounted() {
    this.renderer = new T.WebGLRenderer({
      canvas: this.renderCanvas,
    });
    window.addEventListener("resize", this.resize);
    this.canvas = this.renderCanvas;
  }

  stop(e: MouseEvent) {
    e.preventDefault();
  }

  down(e: MouseEvent) {
    if (e.button != 2) return;
    e.preventDefault();
    addDragEventOnce((e) => {
      this.top += e.movementY;
      this.left += e.movementX;
      e.preventDefault();
    });
  }

  onWheel(e: WheelEvent) {
    // Just a quick way this is not good...
    // Expected is the zoom with anchored preview window center.
    // Also want restrict top offset depend by restriction of zoom.
    this.top += e.deltaY * this.height * this.scale * this.wheelScale;
    this.left += e.deltaY * this.width * this.scale * this.wheelScale;
    this.scale += -e.deltaY * this.wheelScale;
    if (this.scale < 0.1) this.scale = 0.1;
    else if (this.scale > 1) this.scale = 1;
    this.resize();
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

  @Watch("width")
  @Watch("height")
  resize() {
    this.renderer?.setSize(
      this.width * this.previewScale,
      this.height * this.previewScale
    );
    this.resizeCanvas();
  }

  resizeCanvas() {
    if (!this.renderCanvas) return;
    const transform = `scale(${this.scale / this.previewScale})`;
    this.renderCanvas.style.transform = transform;
  }

  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  }
}
</script>

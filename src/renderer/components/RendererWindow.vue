<template>
  <Modal ref="modal">
    <div class="center">
      <div class="render-view">
        <div class="canvas-wrap" :style="canvasWrapStyle">
          <canvas ref="canvas" :style="canvasStyle" />
        </div>
      </div>
      <ExportingCard
        :ffmpegProgress="ffmpegProgress"
        :ccaptureProgress="ccaptureProgress"
        :isEncoding="isEncoding"
        style="width: 100%"
        @start="encode"
        @close="cancel"
        @download="download"
      />
    </div>
  </Modal>
</template>

<style scoped>
.center {
  margin: auto;
  width: 100%;
  max-width: 600px;
  /* height: 400px; */
}

.render-view {
  background-color: var(--vc-d-4);
  width: 100%;
  display: flex;
  padding: 16px;
}

.canvas-wrap {
  width: 300px;
  height: 400px;
  background-color: gray;
  margin: auto;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref } from "vue-property-decorator";
import * as T from "three";
import { Camera, Scene } from "three";
import Modal from "./vega/Modal.vue";
import Renderer from "~/models/Renderer";
import Recorder from "~/models/Recorder";
import { Strip } from "~/models";
import ExportingCard from "~/components/ExportingCard.vue";

@Component({
  components: { Modal, ExportingCard },
})
export default class Encoder extends Vue {
  @Ref() modal!: Modal;
  @Ref() canvas!: HTMLCanvasElement;

  @Prop() width!: number;
  @Prop() height!: number;
  @Prop({ default: 0 })
  currentTime!: number;

  @Prop()
  strips!: Strip[];

  @Prop({ default: 30 })
  duration!: number;

  @Prop({ default: 60 })
  fps!: number;

  @Prop({})
  scene!: Scene;

  @Prop({})
  camera!: Camera;

  renderer: T.WebGLRenderer | null = null;
  videoEenderer?: Renderer;
  ccaptureProgress: number = 0;
  ffmpegProgress: number = 0;
  recorder?: Recorder;
  isEncoding: boolean = false;

  get canvasStyle(): Partial<CSSStyleDeclaration> {
    return {
      transform: `scale(${this.scale})`,
      transformOrigin: "left top",
    };
  }

  get scale() {
    if (this.height > this.width) {
      return 400 / this.height;
    }
    return 400 / this.width;
  }

  get canvasWrapStyle(): Partial<CSSStyleDeclaration> {
    let width = 400;
    let height = 400;
    if (this.height > this.width) {
      width = (width * this.width) / this.height;
    } else {
      height = (height * this.height) / this.width;
    }
    return {
      width: width + "px",
      height: height + "px",
    };
  }

  mounted() {
    this.renderer = new T.WebGLRenderer({
      canvas: this.canvas,
      preserveDrawingBuffer: true,
    });
    this.resize();
  }

  resize() {
    this.renderer?.setSize(this.width, this.height);
  }

  async cancel() {
    this.modal.close();
    await this.recorder?.cancel();
    await this.videoEenderer?.cancel();
    this.isEncoding = false;
    this.ffmpegProgress = 0;
    this.ccaptureProgress = 0;
  }

  open() {
    this.modal.open();
  }

  async encode() {
    this.isEncoding = true;
    if (!this.renderer) return;
    if (!this.videoEenderer) {
      this.videoEenderer = new Renderer(
        this.width,
        this.height,
        this.fps,
        this.strips,
        this.duration,
        (ratio) => {
          this.ffmpegProgress = ratio;
        }
      );
    }
    this.recorder = new Recorder(
      this.canvas,
      this.scene,
      this.camera,
      this.renderer,
      this.fps,
      Math.ceil(this.duration * this.fps),
      this.strips,
      (r) => {
        this.ccaptureProgress = r;
      },
      (data) => {
        this.videoEenderer?.encode(data);
      }
    );
    await this.recorder.start();
  }

  download() {
    this.videoEenderer?.downloadOutput();
  }
}
</script>
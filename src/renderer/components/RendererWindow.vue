<template>
  <sp-dialog :isOpen="isOpen">
    <div style="overflow: hidden">
      <div>
        <div class="render-view">
          <div class="canvas-wrap" :style="canvasWrapStyle">
            <canvas ref="canvas" :style="canvasStyle" />
          </div>
        </div>
      </div>
      <div>
        <ExportingCard
          :ffmpegProgress="ffmpegProgress"
          :ccaptureProgress="ccaptureProgress"
          :isEncoding="isEncoding"
          @start="encode"
          @close="cancel"
          @download="download"
        />
      </div>
    </div>
  </sp-dialog>
</template>

<style scoped>
.center {
  margin: auto;
  width: 100%;
}

.render-view {
  display: flex;
  padding: 16px;
}

.canvas-wrap {
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
import Encoder from "~/models/Encoder";
import Recorder from "~/models/Recorder";
import ExportingCard from "~/components/ExportingCard.vue";
import { Project } from "~/models/Project";

@Component({
  components: { Modal, ExportingCard },
})
export default class Encoder extends Vue {
  @Ref() canvas!: HTMLCanvasElement;

  isOpen = false;

  @Prop() project!: Project;

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
    if (this.project.height > this.project.width) {
      return 400 / this.project.height;
    }
    return 400 / this.project.width;
  }

  get canvasWrapStyle(): Partial<CSSStyleDeclaration> {
    let width = 400;
    let height = 400;
    if (this.project.height > this.project.width) {
      width = (width * this.project.width) / this.project.height;
    } else {
      height = (height * this.project.height) / this.project.width;
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
    this.renderer?.setSize(this.project.width, this.project.height);
  }

  async cancel() {
    this.isOpen = false;
    await this.recorder?.cancel();
    await this.videoEenderer?.cancel();
    this.isEncoding = false;
    this.ffmpegProgress = 0;
    this.ccaptureProgress = 0;
  }

  open() {
    this.isOpen = true;
  }

  async encode() {
    this.isEncoding = true;
    if (!this.renderer) return;
    if (!this.videoEenderer) {
      this.videoEenderer = new Renderer(
        this.project.width,
        this.project.height,
        this.project.fps,
        this.project.strips,
        this.project.duration,
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
      this.project.fps,
      Math.ceil(this.project.duration * this.project.fps),
      this.project.strips,
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
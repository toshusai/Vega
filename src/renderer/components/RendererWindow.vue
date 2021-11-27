<template>
  <sp-dialog :isOpen="isOpen" header="Export" style="scroll: visible">
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

    <sp-button-group :dialog="true">
      <sp-button type="primary" :group="true" :primary="true" @click="cancel">
        Close
      </sp-button>
      <sp-button
        v-if="!isEncoding"
        :group="true"
        :disabled="!isSupportBroeser"
        @click="encode"
      >
        Start
      </sp-button>
      <sp-button
        v-if="end"
        :group="true"
        :disabled="!isSupportBroeser"
        @click="download"
      >
        Download
      </sp-button>
    </sp-button-group>
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
import { isSupportBroeser } from "~/plugins/browser";

@Component({
  components: { Modal, ExportingCard },
})
export default class RendererWindow extends Vue {
  @Ref() canvas!: HTMLCanvasElement;

  @Prop() project!: Project;
  @Prop({}) scene!: Scene;
  @Prop({}) camera!: Camera;

  isOpen = false;

  renderer: T.WebGLRenderer | null = null;
  videoEenderer?: Encoder;
  ccaptureProgress: number = 0;
  ffmpegProgress: number = 0;
  recorder?: Recorder;
  isEncoding: boolean = false;

  get end() {
    return this.ffmpegProgress >= 1 && this.ccaptureProgress >= 1;
  }

  get isSupportBroeser() {
    return isSupportBroeser();
  }

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
  }

  open() {
    this.isOpen = true;
    this.isEncoding = false;
    this.ffmpegProgress = 0;
    this.ccaptureProgress = 0;
  }

  async encode() {
    this.isEncoding = true;
    if (!this.renderer) return;
    if (!this.videoEenderer) {
      this.videoEenderer = new Encoder(
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
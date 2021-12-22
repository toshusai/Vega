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
          v-if="mode == 'ffmpeg'"
          :ffmpegProgress="ffmpegProgress"
          :ffmpegProgressPreparation="ffmpegProgressPreparation"
          :ccaptureProgress="ccaptureProgress"
          :isEncoding="isEncoding"
          @start="encode"
          @close="cancel"
          @download="download"
        />
        <sp-progress-bar
          v-else
          :value="mediaRecorderProgressView"
          style="width: 100%; margin: auto"
        >
          Progress
        </sp-progress-bar>
      </div>
    </div>

    <sp-divider />
    <sp-field-label>Mode</sp-field-label>
    <vega-select
      :value="mode"
      :items="modeItems"
      :disabled="isEncoding"
      @change="(v) => (mode = v.value)"
    />

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
import { download } from "../plugins/download";
import Modal from "./vega/Modal.vue";
import Encoder from "~/models/Encoder";
import Recorder from "~/models/Recorder";
import MediaRecorderRecorder from "~/models/MediaRecorderRecorder";
import ExportingCard from "~/components/ExportingCard.vue";
import { Project } from "~/models/Project";
import { isSupportBroeser } from "~/plugins/browser";
import VegaSelect from "~/components/vega/VegaSelect.vue";

@Component({
  components: {
    Modal,
    ExportingCard,
    VegaSelect,
  },
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
  ffmpegProgressPreparation: number = 0;
  mediaRecorderProgress: number = 0;
  recorder?: Recorder;
  isEncoding: boolean = false;

  mediaRecorder?: MediaRecorderRecorder;
  mediaRecorderResult: Blob | null = null;

  mode: "ffmpeg" | "MediaRecorder" = "ffmpeg";

  modeItems = [
    { text: "ffmpeg", value: "ffmpeg" },
    { text: "MediaRecorder", value: "MediaRecorder" },
  ];

  get end() {
    return (
      (this.ffmpegProgress >= 1 && this.ccaptureProgress >= 1) ||
      this.mediaRecorderProgress >= 1
    );
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

  get mediaRecorderProgressView() {
    return Math.round(this.mediaRecorderProgress * 100);
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
    this.isEncoding = false;
    this.ffmpegProgress = 0;
    this.ccaptureProgress = 0;
    this.mediaRecorderProgress = 0;
    await this.recorder?.cancel();
    await this.videoEenderer?.cancel();
    await this.mediaRecorder?.cancel();
  }

  open() {
    this.isOpen = true;
    this.resize();
  }

  async encode() {
    this.isEncoding = true;
    if (!this.renderer) return;
    if (this.mode == "MediaRecorder") {
      if (!this.mediaRecorder) {
        this.mediaRecorder = new MediaRecorderRecorder(
          this.canvas,
          this.scene,
          this.camera,
          this.renderer,
          this.project.fps,
          Math.ceil(this.project.duration * this.project.fps),
          this.project.strips,
          (r) => {
            this.mediaRecorderProgress = r;
          },
          (blob) => {
            this.mediaRecorderProgress = 1;
            this.mediaRecorderResult = blob;
          }
        );
      }
      this.mediaRecorder.start();
      return;
    }
    if (!this.videoEenderer) {
      this.videoEenderer = new Encoder(
        this.project.width,
        this.project.height,
        this.project.fps,
        this.project.strips,
        this.project.duration,
        (ratio) => {
          this.ffmpegProgress = ratio;
        },
        (ratio) => {
          this.ffmpegProgressPreparation = ratio;
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
    if (this.mode == "ffmpeg") {
      this.videoEenderer?.downloadOutput();
    } else if (this.mode == "MediaRecorder") {
      if (this.mediaRecorderResult)
        download(this.mediaRecorderResult, this.project.name + ".webm");
    }
  }
}
</script>
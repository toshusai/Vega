<template>
  <div>
    <VegaButton @click="encode"> Export </VegaButton>
    <!-- <Modal ref="modal">
      <div
        style="
          position: absolute;
          white-space: nowrap;
          height: 100vh;
          overflow: scroll;
        "
      >
        <div v-for="(log, i) in logs" :key="i">
          {{ log }}
        </div>
      </div>
      <ExportingCard
        :ccaptureProgress="ccaptureProgress"
        :ffmpegProgress="ffmpegProgress"
        @close="close"
      />
    </Modal> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FFmpeg from "@ffmpeg/ffmpeg";
import { Component, Prop, Ref } from "vue-property-decorator";
import VegaButton from "./vega/VegaButton.vue";
import Modal from "./vega/Modal.vue";
import { download } from "~/plugins/download";
import { AudioStrip, Strip, VideoStrip } from "~/models";
import { getExt } from "~/plugins/file";
import { VegaError } from "~/plugins/error";

const WEBM_FILE_NAME = "_vega_video.webm";
const OUTPUT_FILE_NAME = "out.mp4";

@Component({
  components: { VegaButton, Modal },
})
export default class Encoder extends Vue {
  @Prop({})
  canvas!: HTMLCanvasElement;

  @Prop({ default: 0 })
  currentTime!: number;

  @Prop()
  strips!: Strip[];

  @Prop({ default: 30 })
  duration!: number;

  @Prop({ default: 60 })
  fps!: number;

  @Ref() modal?: Modal;

  isEncoding: boolean = false;
  time: number = 0;
  i: number = 0;
  ffmpeg: FFmpeg.FFmpeg | null = null;

  capturer: CCapture | null = null;

  ffmpegProgress: number = 0;

  logs: string[] = [];

  get frames() {
    return Math.round(this.duration * this.fps);
  }

  get ccaptureProgress() {
    return this.i / this.frames;
  }

  mounted() {
    this.capturer = new CCapture({ format: "webm" });
    this.initFFmpeg();
  }

  log(params: { type: string; message: string }) {
    const now = new Date();
    const time = now.toISOString().substr(0, 19).replace("T", " ");
    const ms = (now.getTime() / 1000).toFixed(4).split(".")[1];
    const log = `[${time}.${ms}] ${params.message}`;
    this.logs.splice(0, 0, log);
  }

  close() {
    this.modal?.close();
  }

  // 1) Start export
  async encode() {
    if (!this.ffmpeg) {
      await this.initFFmpeg();
    }
    if (!this.ffmpeg) return;

    this.$emit("changeCurrentTime", 0);
    this.time = 0;
    this.isEncoding = true;
    this.i = 0;
    this.ffmpegProgress = 0;
  }

  // 2) Init FFmpeg
  private async initFFmpeg() {
    this.ffmpeg = FFmpeg.createFFmpeg({
      log: true,
      corePath: "/ffmpeg/ffmpeg-core.js",
      logger: this.log,
    });
    await this.ffmpeg.load();
    this.ffmpeg.setProgress(({ ratio }) => {
      this.ffmpegProgress = ratio;
    });
  }

  // 3) Capture
  async step() {
    if (this.isEncoding) {
      this.$emit("changeCurrentTime", this.time);
      if (this.i == 0) {
        this.capturer?.start();
        this.modal?.open();
      }
      this.capturer?.capture(this.canvas);
      this.time += 1 / this.fps;
      this.i++;
      if (this.i == this.frames) {
        this.isEncoding = false;
        // 4)
        await this.writeAssets();
        // 5)
        await this.writeWebm();
        // 6)
        await this.runFFmpeg();
        // 7)
        this.downloadOutput();
        // 7)
        await this.unlinkAssets();
      }
    }
  }

  // 4) Write WebM
  private writeWebm() {
    return new Promise<void>((resolve, reject) => {
      this.capturer?.stop();
      this.capturer?.save(async (blob: Blob) => {
        try {
          const fileData = new Uint8Array(await blob.arrayBuffer());
          this.ffmpeg?.FS("writeFile", WEBM_FILE_NAME, fileData);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  // 5) Write Assets
  private async writeAssets() {
    if (!this.ffmpeg) return;
    for (let i = 0; i < this.strips.length; i++) {
      const strip = this.strips[i];
      if (strip instanceof VideoStrip && strip.videoAsset) {
        const fileName = strip.videoAsset.id + getExt(strip.videoAsset.name);
        const fileData = await FFmpeg.fetchFile(strip.videoAsset.path);
        this.ffmpeg.FS("writeFile", fileName, fileData);
      } else if (strip instanceof AudioStrip && strip.asset) {
        const fileName = strip.asset.id + getExt(strip.asset.name);
        const fileData = await FFmpeg.fetchFile(strip.asset.path);
        this.ffmpeg.FS("writeFile", fileName, fileData);
      }
    }
  }

  // 6) Run FFmpeg
  async runFFmpeg() {
    if (!this.ffmpeg) return;

    let args = ["-y", "-i", WEBM_FILE_NAME];

    const mapOptions: string[] = [];

    // Add Audio Mix Filter
    let i = 1;
    let out = "";
    this.strips.forEach((s) => {
      if (
        (s instanceof VideoStrip && s.videoAsset) ||
        (s instanceof AudioStrip && s.asset)
      ) {
        out += `[out${i}]`;
        i++;
      }
    });
    mapOptions.push(`${out}amix=inputs=${i - 1}[out]`);

    // Add Delay Filter
    i = 1;
    this.strips.forEach((s) => {
      if (s instanceof VideoStrip && s.videoAsset) {
        let startMs = Math.round(s.start * 1000);
        if (s.start < 0) {
          args = args.concat(["-ss", (-s.start).toFixed(4)]);
          startMs = 0;
        }
        mapOptions.push(`[${i}:a]adelay=${startMs}|${startMs}[out${i}]`);
        args = args.concat(["-i", s.videoAsset.id + getExt(s.videoAsset.name)]);
        i++;
      } else if (s instanceof AudioStrip && s.asset) {
        let startMs = Math.round(s.start * 1000);
        if (s.start < 0) {
          args = args.concat(["-ss", (-s.start).toFixed(4)]);
          startMs = 0;
        }
        mapOptions.push(`[${i}:a]adelay=${startMs}|${startMs}[out${i}]`);
        args = args.concat(["-i", s.asset.id + getExt(s.asset.name)]);
        i++;
      }
    });

    // Size Settings
    args = args.concat("-s", "1280x720");

    // Add Filter
    if (i > 1) {
      args = args.concat([
        "-filter_complex",
        `` + mapOptions.reverse().join(";") + ``,
      ]);
      args = args.concat(["-map", "[out]:a"]);
      args = args.concat(["-c:a", "aac"]);
    }

    args = args.concat(["-map", "0:v"]);

    args = args.concat([
      "-t",
      (this.frames / this.fps).toString(),
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-s",
      "1280x720",
      OUTPUT_FILE_NAME,
    ]);

    await this.ffmpeg.run(...args);
  }

  downloadOutput() {
    if (!this.ffmpeg) return;
    try {
      const data = this.ffmpeg.FS("readFile", OUTPUT_FILE_NAME);
      const blob = new Blob([data.buffer], { type: "video/mp4" });
      download(blob, OUTPUT_FILE_NAME);
    } catch (e) {
      throw new VegaError("Fail Export " + e);
    }
  }

  // 7) Unlink Assets
  private unlinkAssets() {
    if (!this.ffmpeg) return;
    for (let i = 0; i < this.strips.length; i++) {
      const strip = this.strips[i];
      if (strip instanceof VideoStrip && strip.videoAsset) {
        const fileName = strip.videoAsset.id + getExt(strip.videoAsset.name);
        this.ffmpeg.FS("unlink", fileName);
      } else if (strip instanceof AudioStrip && strip.asset) {
        const fileName = strip.asset.id + getExt(strip.asset.name);
        this.ffmpeg.FS("unlink", fileName);
      }
    }
    this.ffmpeg.FS("unlink", WEBM_FILE_NAME);
  }
}
</script>

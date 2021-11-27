import FFmpeg from "@ffmpeg/ffmpeg";
import { AudioStrip, Strip, VideoStrip } from "./strips";
import { download } from "~/plugins/download";
import { VegaError } from "~/plugins/error";
import { getExt } from "~/plugins/file";

const WEBM_FILE_NAME = "_vega_video.webm";
const OUTPUT_FILE_NAME = "out.mp4";

export default class Encoder {
  strips: Strip[];
  fps: number;
  duration: number;
  width: number;
  height: number;

  isEncoding: boolean = false;
  time: number = 0;
  i: number = 0;
  ffmpeg: FFmpeg.FFmpeg | null = null;

  ffmpegProgress: number = 0;

  logs: string[] = [];

  linkFiles: Map<string, boolean> = new Map();

  onProgress: (rartio: number) => void;

  get frames() {
    return Math.round(this.duration * this.fps);
  }

  constructor(
    width: number,
    height: number,
    fps: number,
    strips: Strip[],
    duration: number,
    onProgress: (ratio: number) => void
  ) {
    this.width = width;
    this.height = height;
    this.strips = strips;
    this.fps = fps;

    this.duration = duration;
    this.onProgress = onProgress;
  }

  writeFile(fileName: string, binaryData: Uint8Array) {
    this.ffmpeg?.FS("writeFile", fileName, binaryData);
    this.linkFiles.set(fileName, true);
  }

  removeFile(fileName: string) {
    if (this.linkFiles.get(fileName)) {
      this.ffmpeg?.FS("unlink", fileName);
      this.linkFiles.delete(fileName);
    }
  }

  log(params: { type: string; message: string }) {
    const now = new Date();
    const time = now.toISOString().substr(0, 19).replace("T", " ");
    const ms = (now.getTime() / 1000).toFixed(4).split(".")[1];
    const log = `[${time}.${ms}] ${params.message}`;
    this.logs.splice(0, 0, log);
  }

  async cancel() {
    this.isEncoding = false;
    try {
      this.ffmpeg?.exit();
    } catch (e) {}
    await this.unlinkAssets();
    this.ffmpeg = null;
  }

  async encode(srcVideoFile: Uint8Array) {
    await this.initFFmpeg();
    this.writeFile(WEBM_FILE_NAME, srcVideoFile);
    this.time = 0;
    this.isEncoding = true;
    this.i = 0;
    this.ffmpegProgress = 0;
    await this.writeAssets();
    await this.runFFmpeg();
    await this.unlinkAssets();
  }

  private async initFFmpeg() {
    this.ffmpeg = FFmpeg.createFFmpeg({
      log: true,
      corePath: "/static/js/ffmpeg/ffmpeg-core.js",
      logger: (v) => this.log(v),
    });
    await this.ffmpeg.load();
    this.ffmpeg.setProgress((progress) => {
      let ratio = progress.ratio;
      if ("time" in progress) {
        const p = progress as { time: number; ratio: number };
        ratio = p.time / this.duration;
      }
      this.ffmpegProgress = ratio;
      this.onProgress(ratio);
    });
  }

  private async writeAssets() {
    if (!this.ffmpeg) return;
    for (let i = 0; i < this.strips.length; i++) {
      const strip = this.strips[i];
      if (strip instanceof VideoStrip && strip.videoAsset) {
        const fileName = strip.videoAsset.id + getExt(strip.videoAsset.name);
        const fileData = await FFmpeg.fetchFile(strip.videoAsset.path);
        this.writeFile(fileName, fileData);
        const stripFileName = strip.id + getExt(strip.videoAsset.name);
        await this.ffmpeg.run(
          ...[
            "-y",
            "-i",
            fileName,
            "-ss",
            strip.start.toString(),
            "-t",
            strip.length.toString(),
            stripFileName,
          ]
        );
        this.removeFile(fileName);
      } else if (strip instanceof AudioStrip && strip.asset) {
        const fileName = strip.asset.id + getExt(strip.asset.name);
        const fileData = await FFmpeg.fetchFile(strip.asset.path);
        this.writeFile(fileName, fileData);
        const stripFileName = strip.id + getExt(strip.asset.name);
        await this.ffmpeg.run(
          ...[
            "-y",
            "-i",
            fileName,
            "-ss",
            strip.start.toString(),
            "-t",
            strip.length.toString(),
            stripFileName,
          ]
        );
        this.removeFile(fileName);
      }
    }
  }

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
        args = args.concat(["-i", s.id + getExt(s.asset.name)]);
        i++;
      }
    });

    // Size Settings
    args = args.concat("-s", `${this.width}x${this.height}`);

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
      `${this.width}x${this.height}`,
      OUTPUT_FILE_NAME,
    ]);

    await this.ffmpeg.run(...args);
  }

  private unlinkAssets() {
    if (!this.ffmpeg) return;
    for (let i = 0; i < this.strips.length; i++) {
      const strip = this.strips[i];
      if (strip instanceof VideoStrip && strip.videoAsset) {
        const fileName = strip.id + getExt(strip.videoAsset.name);
        this.removeFile(fileName);
      } else if (strip instanceof AudioStrip && strip.asset) {
        const fileName = strip.id + getExt(strip.asset.name);
        this.removeFile(fileName);
      }
    }
    this.removeFile(WEBM_FILE_NAME);
  }

  downloadOutput() {
    if (!this.ffmpeg) return;
    try {
      const data = this.ffmpeg.FS("readFile", OUTPUT_FILE_NAME);
      const blob = new Blob([data.buffer], { type: "video/mp4" });
      download(blob, OUTPUT_FILE_NAME);
      this.removeFile(OUTPUT_FILE_NAME);
    } catch (e) {
      throw new VegaError("Fail Export " + e);
    }
  }
}

<template>
  <div>
    <AppBar
      @renderVideo="renderVideo"
      @openProject="openProject"
      @downloadProject="downloadProject"
    />
    <div style="display: flex; height: 70vh">
      <div style="display: flex; width: 30%">
        <div style="width: 50%; display: flex; flex-flow: column">
          <ProjectWindow
            :duration="duration"
            :strips="strips"
            :currentTime="currentTime"
            :canvas="canvas"
            :fps="fps"
            :width="width"
            :height="height"
            :name="name"
            @changeDuration="(v) => (duration = v)"
            @changeWidth="changeWidth"
            @changeHeight="changeHeight"
            @changeFps="changeFps"
          />
          <AssetWindow
            :assets="assets"
            @changeSelectedAsset="changeSelectedAsset"
            @addAsset="addAsset"
          />
        </div>
        <div style="width: 50%">
          <AssetInspectorWindow
            :asset="selectedAsset"
            @changeAsset="changeAsset"
          />
        </div>
      </div>
      <div style="width: 70%; display: flex; flex-flow: column">
        <PreviewWindow
          ref="previewWindow"
          :currentTime="currentTime"
          :selectedStrip="selectedStrip"
          :fps="fps"
          :width="width"
          :height="height"
          @changeStripPos="changeStripPos"
        />
        <ControllerWindow
          :isPlay="isPlay"
          :playMode="playMode"
          @changePlayMode="changePlayMode"
          @togglePlay="play"
        />
      </div>
    </div>

    <div style="display: flex; height: calc(30vh - 18px)">
      <div style="width: 80%">
        <TimelineWindow
          :currentTime="currentTime"
          :strips="strips"
          :selectedStrips="selectedStrips"
          :duration="duration"
          @addAsset="addAsset"
          @addStrip="addStrip"
          @changeCurrentTime="changeCurrentTime"
          @changeSelectedStrips="changeSelectedStrips"
          @changeStrip="(i, name, value) => changeStripPropery(i, name, value)"
          @deleteStrip="deleteStrip"
        />
      </div>
      <div style="width: 20%">
        <StripInspector
          :strip="selectedStrip"
          :assets="assets"
          @change="changeStrip"
          @changeProperty="
            (name, value) => changeStripPropery(selectedStripIndex, name, value)
          "
        />
      </div>
    </div>

    <Snakbar ref="snakbar" />

    <RendererWindow
      ref="rendererWindow"
      :currentTime="currentTime"
      :fps="fps"
      :strips="strips"
      :duration="duration"
      :width="width"
      :height="height"
      :scene="scene"
      :camera="camera"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as T from "three";
import { Component, Ref } from "vue-property-decorator";
import RendererWindow from "@/components/RendererWindow.vue";
import AppBar from "@/components/app_bar/AppBar.vue";
import PreviewWindow from "~/components/PreviewWindow.vue";
import {
  Asset,
  FontAsset,
  ImageStrip,
  Project,
  Strip,
  Text3DStrip,
  TextStrip,
  VEGA_VERSION,
  VideoAsset,
  VideoStrip,
} from "~/models";
import AssetWindow from "~/components/asset_window/AssetWindow.vue";
import AssetInspectorWindow from "~/components/asset_inspector/AssetInspectorWindow.vue";
import StripInspector from "~/components/strip_inspector_window/StripInspectorWindow.vue";
import TimelineWindow from "~/components/timeline_window/Timeline.vue";
import { download } from "~/plugins/download";
import { AssetUtil } from "~/plugins/asset";
import { StripUtil } from "~/plugins/strip";
import { IVector3 } from "~/models/math/Vector3";
import Snakbar from "~/components/Snakbar.vue";
import { VegaError } from "~/plugins/error";
import { PlayMode, PLAY_EVERY_FRAME, SYNC_TO_AUDIO } from "~/plugins/config";
import { isProject, migrationProject } from "~/models/Project";
import ProjectWindow from "~/components/ProjectWindow.vue";
import ControllerWindow from "~/components/ControllerWindow.vue";

@Component({
  components: {
    ProjectWindow,
    RendererWindow,
    ControllerWindow,
    AppBar,
    PreviewWindow,
    AssetWindow,
    AssetInspectorWindow,
    StripInspector,
    TimelineWindow,
    Snakbar,
  },
})
export default class IndexPage extends Vue {
  @Ref() previewWindow?: PreviewWindow;
  @Ref() snakbar?: Snakbar;
  @Ref() rendererWindow?: RendererWindow;

  camera: T.OrthographicCamera | null = null;
  scene: T.Scene | null = null;
  isPlay: boolean = false;
  duration: number = 15;
  currentTime: number = 0;
  strips: Strip[] = [];
  lastAnimationTime: number = 0;
  playRequests: number[] = [];
  assets: Asset[] = [];
  selectedAsset: Asset | null = null;
  selectedStrips: Strip[] = [];
  canvas: HTMLCanvasElement | null = null;

  width: number = 1920;
  height: number = 1080;
  fps: number = 60;
  name: string = "untitled";

  playMode: PlayMode = PLAY_EVERY_FRAME;

  lastUpdate: number = 0;

  get selectedStrip() {
    if (this.selectedStrips.length > 0) {
      return this.selectedStrips[0];
    }
    return null;
  }

  get selectedStripIndex() {
    return this.strips.findIndex((s) => s == this.selectedStrip);
  }

  async mounted() {
    this.scene = new T.Scene();
    this.camera = new T.OrthographicCamera(0, this.width, this.height, 0);
    this.camera.position.set(0, 0, 10);
    this.canvas = this.previewWindow?.renderCanvas || null;
    await FontAsset.init();
    this.update(0);
  }

  addAsset(asset: Asset) {
    this.assets.push(asset);
  }

  changeAsset(newAsset: Asset) {
    const i = this.assets.findIndex((a) => a == this.selectedAsset);
    const oldAsset = this.assets[i];
    this.assets.splice(i, 1, newAsset);
    this.strips.forEach((s) => {
      if (s instanceof VideoStrip && newAsset instanceof VideoAsset) {
        if (s.videoAsset == oldAsset) {
          s.updateAsset(newAsset);
        }
      }
    });
  }

  changeStripPropery(index: number, name: string, value: any) {
    if (index < 0 || this.strips.length <= index) return;
    const target = this.strips[index];
    switch (name) {
      case "layer":
        target.layer = value;
        break;
      case "length":
        target.length = value;
        break;
      case "start":
        target.start = value;
        break;
      case "videoOffset":
        if (target instanceof VideoStrip) {
          target.videoOffset = value;
        }
        break;
      case "text":
        if (target instanceof TextStrip || target instanceof Text3DStrip) {
          target.text = value;
        }
        break;
      case "position.x":
        if (
          target instanceof VideoStrip ||
          target instanceof Text3DStrip ||
          target instanceof ImageStrip ||
          target instanceof TextStrip
        ) {
          target.position.x = value;
        }
        break;
      case "position.y":
        if (
          target instanceof VideoStrip ||
          target instanceof Text3DStrip ||
          target instanceof ImageStrip ||
          target instanceof TextStrip
        ) {
          target.position.y = value;
        }
        break;
      default:
        break;
    }
  }

  // Replace the strip.
  // Also replace threejs object in scene by THREE.Object3D.uuid
  changeStrip(s: Strip) {
    if (s instanceof Text3DStrip || s instanceof VideoStrip) {
      const target = this.scene?.getObjectByProperty("uuid", s.id);
      if (target) {
        this.scene?.remove(target);
        this.scene?.add(s.obj);
      }
    } else {
      return;
    }

    const i = this.strips.findIndex((_s) => _s.id == s.id);
    if (this.selectedStrips.includes(this.strips[i])) {
      this.selectedStrips = [s];
    } else {
      this.selectedStrips = [];
    }
    this.strips.splice(i, 1, s);
  }

  changeStripPos(pos: IVector3) {
    if (
      this.selectedStrip instanceof VideoStrip ||
      this.selectedStrip instanceof TextStrip ||
      this.selectedStrip instanceof ImageStrip ||
      this.selectedStrip instanceof Text3DStrip
    ) {
      this.selectedStrip.position.set(pos.x, pos.y, pos.z);
    }
  }

  changeStrips(strips: Strip[]) {
    this.strips = strips;
  }

  deleteStrip(strip: Strip) {
    const i = this.strips.findIndex((s) => s == strip);
    if (i != -1) {
      this.strips.splice(i, 1);
    }
  }

  changeWidth(width: number) {
    this.width = width;
    if (this.camera) {
      this.camera.right = this.width;
      this.camera.updateProjectionMatrix();
      this.previewWindow?.resize();
    }
  }

  changeFps(fps: number) {
    this.fps = fps;
  }

  changeHeight(height: number) {
    this.height = height;
    if (this.camera) {
      this.camera.top = this.height;
      this.camera.updateProjectionMatrix();
      this.previewWindow?.resize();
    }
  }

  changeCurrentTime(time: number) {
    this.currentTime = time;
    this.change();
  }

  changeSelectedStrips(strips: Strip[]) {
    this.selectedStrips = strips;
  }

  changeSelectedAsset(asset: Asset) {
    this.selectedAsset = asset;
  }

  changePlayMode(playMode: PlayMode) {
    this.playMode = playMode;
  }

  async update(time: number = 0) {
    if (this.rendererWindow && this.rendererWindow.isEncoding) {
      window.requestAnimationFrame(this.update);
      return;
    }
    if (time - this.lastUpdate + 0.02 <= 1000 / this.fps) {
      window.requestAnimationFrame(this.update);
      return;
    }
    if (this.previewWindow) this.previewWindow.start();

    let delta = time - this.lastAnimationTime;
    this.lastAnimationTime = time;

    if (this.playMode == PLAY_EVERY_FRAME) {
      delta = 1000 / this.fps;
    }

    if (this.isPlay) {
      this.currentTime += delta / 1000;
    }

    for (let i = 0; i < this.strips.length; i++) {
      const s = this.strips[i];
      await s.update(
        this.currentTime,
        delta,
        this.isPlay,
        this.playMode,
        this.fps
      );
    }

    if (this.previewWindow && this.scene && this.camera) {
      this.previewWindow.renderPreview(this.scene, this.camera);
    }

    if (this.previewWindow) this.previewWindow.end();
    this.lastUpdate = time;
    window.requestAnimationFrame(this.update);
  }

  addStrip(ts: Strip) {
    this.strips.push(ts);
    if (
      ts instanceof Text3DStrip ||
      ts instanceof VideoStrip ||
      ts instanceof ImageStrip ||
      ts instanceof TextStrip
    ) {
      this.scene?.add(ts.obj);
    }
  }

  play() {
    this.isPlay = !this.isPlay;
    this.change();
  }

  downloadProject() {
    const project: Project = {
      name: this.name,
      width: this.width,
      height: this.height,
      fps: this.fps,
      duration: this.duration,
      version: VEGA_VERSION,
      assets: this.assets.map((a) => a.toInterface()),
      strips: this.strips.map((s) => s.toInterface()),
    };
    download(new Blob([JSON.stringify(project)]), project.name + ".json");
  }

  getAssetById(id: string) {
    return this.assets.find((a) => a.id == id);
  }

  openProject(project: Project) {
    if (!isProject(project))
      throw new VegaError("Invalid Project file format.");
    project = migrationProject(project);
    this.assets = this.assets.concat(
      AssetUtil.interfacesToInstances(project.assets)
    );

    this.strips = StripUtil.interfacesToInstances(project.strips, this.assets);

    this.strips.forEach((s) => {
      if (
        s instanceof Text3DStrip ||
        s instanceof VideoStrip ||
        s instanceof ImageStrip
      ) {
        this.scene?.add(s.obj);
      }
    });

    this.width = project.width;
    this.height = project.height;
    this.fps = project.fps;
    this.duration = project.duration;
    this.name = project.name;

    this.previewWindow?.resize();
  }

  change() {
    this.strips.forEach((s: Strip) => {
      s.update(this.currentTime, 0, false, SYNC_TO_AUDIO, this.fps);
    });
  }

  errorCaptured(err: Error, _vm: any, _info: any) {
    if (err instanceof VegaError) {
      this.snakbar?.open(3000, err.message);
      return false;
    }
  }

  renderVideo() {
    if (!this.rendererWindow) return;
    this.rendererWindow.open();
  }
}
</script>

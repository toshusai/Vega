<template>
  <div class="root" data-vega-timeline>
    <div style="display: flex; height: 32px">
      <div style="margin: auto">
        <sp-action-button
          data-vega-play-button
          size="S"
          :quiet="true"
          @click="$emit('togglePlay')"
        >
          <sp-icon
            :name="!isPlay ? 'Play' : 'Pause'"
            style="width: 12px"
          ></sp-icon>
        </sp-action-button>
      </div>
      <sp-action-group :compact="true" :quiet="true">
        <sp-action-button
          size="S"
          :quiet="true"
          :item="true"
          @click="downScale"
        >
          <sp-icon name="ZoomOut" style="width: 12px" />
        </sp-action-button>
        <sp-action-button size="S" :quiet="true" :item="true" @click="upScale">
          <sp-icon name="ZoomIn" style="width: 12px" />
        </sp-action-button>
      </sp-action-group>
    </div>

    <div
      ref="scroll"
      class="timeline-container"
      data-vega-timeline-container
      @drop="drop"
      @dragover="dragover"
      @contextmenu="openContextMenu"
      @wheel="onScroll"
    >
      <Seekline
        :length="duration"
        :scale="scale"
        :pos="currentTime"
        :start="start"
        :fps="fps"
        @changePos="changeCurrentTime"
      />
      <div ref="timeline" class="timeline">
        <div style="margin-top: 1px" />
        <div v-for="(_, i) in [...Array(4)]" ref="layers" :key="i">
          <timeline-layer />
        </div>
        <!-- <div class="linehr" /> -->
        <div class="stips">
          <TimelineStrip
            v-for="(strip, j) in showStrips"
            ref="textLineComps"
            :key="j"
            :timelineStart="start"
            :scale="scale"
            :strip="strip"
            :selected="isSelected(strip)"
            :layers="$refs.layers"
            :valid="getValid(strip)"
            :fps="fps"
            @click="selectStrip(strip)"
            @changeStart="(v) => changeStart(strip, v)"
            @submitStart="() => submitStart(j, strip)"
            @changeLength="(v) => changeLength(strip, v)"
            @changeLayer="(v) => changeLayer(strip, v)"
          />
        </div>
        <timeline-out-area :scale="scale" />
        <timeline-out-area style="right: 0; left: auto" :scale="scale" />
      </div>
      <ContextMenu ref="contextMenu" />
      <!-- <sp-context-menu ref="contextMenu" :items="items" /> -->
    </div>
  </div>
</template>

<style scoped>
.root {
  position: relative;
  height: 100%;
  height: 100%;
}
.timeline-container {
  overflow-x: hidden;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  overflow-y: hidden;
  /* -32px for controll header */
  height: calc(100% - 32px);
}
/* .timeline-container::-webkit-scrollbar {
  display: none;
} */

.timeline {
  position: relative;
  overflow-x: hidden;
  height: calc(100% - 20px);
}

.stips {
  position: absolute;
  top: 0px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Ref, Watch } from "vue-property-decorator";
import { v4 } from "uuid";
import TimelineOutArea from "./TimelineOutArea.vue";
import TimelineLayer from "./TimelineLayer.vue";
import TimelineStrip from "./strips/TimelineStrip.vue";
import Seekline from "./TimelineSeekline.vue";
import TimelineZoomButtons from "./TimelineZoomButtons.vue";
import WindowNameTag from "~/components/vega/WindowNameTag.vue";
import {
  AudioAsset,
  AudioStrip,
  Strip,
  Text3DStrip,
  TextStrip,
  VideoAsset,
  VideoStrip,
  ImageStrip,
  ImageAsset,
} from "~/models";
import ContextMenu, {
  ContextMenuItem,
} from "~/components/vega/contextmenu/ContextMenu.vue";
import MenuButton from "~/components/vega/MenuButton.vue";
import { VegaError } from "~/plugins/error";
import { roundToFrame } from "~/plugins/utils/roundToFrame";

@Component({
  components: {
    TimelineStrip,
    Seekline,
    ContextMenu,
    TimelineOutArea,
    TimelineLayer,
    TimelineZoomButtons,
    WindowNameTag,
    MenuButton,
  },
})
export default class TimelinePanel extends Vue {
  @PropSync("stripsSync")
  strips!: Strip[];

  @Prop({ default: 0 })
  currentTime!: number;

  @Prop({ default: false })
  isPlay!: boolean;

  @Prop({ default: () => [] })
  selectedStrips!: Strip[];

  @Prop({ default: 0 })
  duration!: number;

  @Prop({ default: 60 })
  fps!: number;

  @Ref() scroll!: HTMLElement;

  @Ref() contextMenu!: ContextMenu;

  // pixels per second
  scale: number = 10;
  start: number = 0;

  minScale: number = 1;
  maxScale: number = 1000;

  get timeline() {
    return this.$refs.timeline as HTMLElement;
  }

  /**
   * The length seconds to render
   */

  showLength = 0;

  updateShowLength() {
    const rect = this.$el.getBoundingClientRect();
    const length = rect.width / this.scale;
    this.showLength = length;
  }

  get showStrips() {
    return this.strips.filter((s) => {
      return (
        s.start + s.length > this.start &&
        s.start < this.start + this.showLength
      );
    });
  }

  get hasSelectedStrip() {
    return this.selectedStrips.length > 0;
  }

  mounted() {
    this.updateShowLength();
    this.updateMinScale();
    window.addEventListener("resize", () => {
      this.updateMinScale();
    });
  }

  @Watch("duration")
  updateMinScale() {
    if (this.scale < this.minScale) {
      this.scale = this.minScale;
    }
  }

  onScroll(e: WheelEvent) {
    e.preventDefault();
    this.start += e.deltaX / this.scale;
  }

  addStripEmit(strip: Strip) {
    this.$emit("addStrip", strip);
  }

  deleteStripEmit(strip: Strip) {
    this.$emit("deleteStrip", strip);
  }

  addStrip(strip: Strip) {
    // 4 is max layers
    for (let i = 0; i < 4; i++) {
      strip.layer = i;
      if (this.getValid(strip)) break;
    }
    this.addStripEmit(strip);
  }

  addText3DStrip() {
    const newStrip = new Text3DStrip(Text3DStrip.defaultFont);
    newStrip.start = this.currentTime;
    newStrip.length = 5;
    newStrip.text = "New Text";
    newStrip.position.set(100, 100, -10);
    this.addStrip(newStrip);
  }

  addTextStrip() {
    const newStrip = new TextStrip({
      id: v4(),
      start: this.currentTime,
      length: 5,
      layer: 0,
      text: "New Text",
      fontSize: 14,
      fontFamily: "serif",
      color: "white",
      position: { x: 0, y: 0, z: 0 },
      type: "Text",
      shadowColor: "",
      shadowBlur: 0,
      outlineColor: "",
      outlineSize: 0,
    });
    newStrip.start = this.currentTime;
    newStrip.length = 5;
    newStrip.position.set(500, 500, -10);
    this.addStrip(newStrip);
  }

  addVideoStrip() {
    const newStrip = new VideoStrip({
      start: this.currentTime,
      length: 5,
      layer: 0,
      position: { x: 0, y: 0, z: 0 },
      src: "",
      id: "",
      type: "Video",
      assetId: "",
      videoOffset: 0,
    });
    this.addStrip(newStrip);
  }

  addImageStrip() {
    const newStrip = new ImageStrip({
      start: this.currentTime,
      length: 5,
      layer: 0,
      position: { x: 200, y: 200, z: 0 },
      src: "",
      id: "",
      type: "Image",
      assetId: "",
    });
    this.addStrip(newStrip);
  }

  addAudioStrip() {
    const newStrip = new AudioStrip({
      id: "",
      start: 0,
      length: 5,
      layer: 0,
      type: "Audio",
    });
    this.addStrip(newStrip);
  }

  openContextMenu(e: MouseEvent) {
    this.contextMenu.open(e, this.items);
    e.preventDefault();
  }

  get items() {
    const items: ContextMenuItem[] = [
      { text: "Add Text", action: this.addTextStrip },
      { text: "Add Video", action: this.addVideoStrip },
      { text: "Add Image", action: this.addImageStrip },
      { text: "Add Audio", action: this.addAudioStrip },
    ];
    if (this.hasSelectedStrip) {
      items.push({ text: "Split", action: this.split });
      items.push({ text: "Delete", action: this.deleteStrip });
    }
    return items;
  }

  changeCurrentTime(time: number) {
    this.$emit("changeCurrentTime", time);
  }

  /**
   * Zoom in timeline.
   * Keep visual currentTime.
   */
  upScale() {
    if (this.scale * 2 < this.maxScale) {
      this.updateShowLength();
      const leftLength = this.currentTime - this.start;
      const rate = leftLength / this.showLength;
      this.scale *= 2;
      this.updateShowLength();
      this.start = this.currentTime - rate * this.showLength;
    }
  }

  /**
   * Zoom out timeline.
   * Keep visual currentTime.
   */
  downScale() {
    if (this.scale * 0.5 < this.minScale) {
      this.scale = this.minScale;
    } else {
      this.updateShowLength();
      const leftLength = this.currentTime - this.start;
      const rate = leftLength / this.showLength;
      this.scale *= 0.5;
      this.updateShowLength();
      this.start = this.currentTime - rate * this.showLength;
    }
  }

  selectStrip(strip: Strip) {
    this.$emit("changeSelectedStrips", [strip]);
  }

  isSelected(strip: Strip) {
    return this.selectedStrips.includes(strip);
  }

  getValid(self: Strip) {
    for (let j = 0; j < this.strips.length; j++) {
      const t = this.strips[j];
      if (self == t) continue;
      const ts = t.start;
      const te = t.length + ts;
      if (
        self.end > ts + 0.001 &&
        self.start + 0.001 < te &&
        self.layer == t.layer
      ) {
        return false;
      }
    }
    return true;
  }

  update(self: Strip) {
    const end = self.start + self.length;
    const contacts = [];
    for (let j = 0; j < this.strips.length; j++) {
      const t = this.strips[j];
      if (self == t) continue;
      const ts = t.start;
      const te = t.length + ts;
      if (end > ts && self.start < te) {
        contacts.push(t);
      }
    }
  }

  changeStart(target: Strip, v: number) {
    target.start = v;
    const valid = this.getValid(target);
    if (!valid) {
      this.strips.forEach((s) => {
        if (s == target) return;
        if (target.layer == s.layer) {
          const center = s.start;
          if (v > center && v < s.start + s.length) {
            v = roundToFrame(s.start + s.length, this.fps);
            target.start = v;
          } else if (v < center && v + target.length > s.start) {
            v = roundToFrame(s.start - target.length, this.fps);
            target.start = v;
          }
        }
      });
    }
    // this.$emit("changeStrip", i, "start", v);
  }

  submitStart(i: number, target: Strip) {
    if (!this.getValid(target)) {
      (this.$refs as any).textLineComps[i].rollback();
    }
  }

  changeLength(target: Strip, v: number) {
    target.length = v;
    const valid = this.getValid(target);
    if (!valid) {
      this.strips.forEach((s) => {
        if (s == target) return;
        if (target.layer == s.layer) {
          // contact back to forward
          const center = s.start + s.length / 2;
          if (v > center && v < s.start + s.length) {
            v = roundToFrame(s.start + s.length, this.fps);
            target.length = v;
          } else if (
            target.start < center &&
            target.start + target.length > s.start
          ) {
            v = roundToFrame(s.start - target.start, this.fps);
            target.length = v;
          }
        }
      });
    }
  }

  dragover(e: DragEvent) {
    e.preventDefault();
  }

  split() {
    if (this.selectedStrips.length == 0)
      throw new VegaError("Split operation target strip is not found.");
    const target = this.selectedStrips[0];
    const i = this.strips.findIndex((s) => s == target);
    if (i == -1)
      throw new VegaError("Split operation target strip is not found.");
    if (target instanceof VideoStrip) {
      const newStrip = new VideoStrip(
        {
          start: this.currentTime,
          length: target.end - this.currentTime,
          layer: 0,
          position: target.position,
          src: "",
          id: "",
          type: "Video",
          assetId: target.videoAsset?.id || "",
          videoOffset: this.currentTime - target.start + target.videoOffset,
        },
        target.videoAsset
      );
      const length = this.currentTime - target.start;
      this.changeLength(target, length);
      this.addStrip(newStrip);
    } else {
      throw new VegaError(
        `Split operations are not supported in ${target.type}.`
      );
    }
  }

  deleteStrip() {
    if (this.selectedStrips.length > 0) {
      this.deleteStripEmit(this.selectedStrips[0]);
    }
  }

  drop(e: DragEvent) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length == 1) {
      const file = files[0];
      const src = window.URL.createObjectURL(file);
      if (VideoAsset.isSupportType(file.type)) {
        const asset = new VideoAsset(v4(), file.name, src);
        this.$emit("addAsset", asset);
        const newStrip = new VideoStrip(
          {
            start: this.currentTime,
            length: 5,
            layer: 0,
            position: { x: 0, y: 0, z: 0 },
            src: "",
            id: "",
            type: "Video",
            assetId: asset.id,
            videoOffset: 0,
          },
          asset
        );
        this.addStrip(newStrip);
      } else if (AudioAsset.isSupportType(file.type)) {
        const asset = new AudioAsset(v4(), file.name, src);
        this.$emit("addAsset", asset);
        const newStrip = new AudioStrip(
          {
            start: this.currentTime,
            length: 5,
            layer: 0,
            id: "",
            type: "Audio",
          },
          asset
        );
        this.addStrip(newStrip);
      } else if (ImageAsset.isSupportType(file.type)) {
        const asset = new ImageAsset(v4(), file.name, src);
        this.$emit("addAsset", asset);
        const newStrip = new ImageStrip(
          {
            start: this.currentTime,
            length: 5,
            layer: 0,
            position: { x: 0, y: 0, z: 0 },
            src: "",
            id: "",
            type: "Image",
            assetId: asset.id,
          },
          asset
        );
        this.addStrip(newStrip);
      } else {
        throw new VegaError(`Not supported "${file.type}".`);
      }
    } else {
      throw new VegaError(`Not supported drop multiple files.`);
    }
  }
}
</script>

<template>
  <div class="root" data-vega-timeline>
    <WindowNameTag name="Timeline" />
    <div>
      <timeline-zoom-buttons @downScale="downScale" @upScale="upScale" />
    </div>

    <div
      ref="scroll"
      class="timeline-container"
      data-vega-timeline-container
      @drop="drop"
      @dragover="dragover"
      @contextmenu="openContextMenu"
    >
      <Seekline
        :length="duration"
        :scale="scale"
        :pos="currentTime"
        :offset="scale * 10"
        :style="seeklineStyle"
        @changePos="changeCurrentTime"
      />
      <div ref="timeline" class="timeline" :style="timelineStyle">
        <div style="margin-top: 1px" />
        <div v-for="(_, i) in [...Array(4)]" ref="layers" :key="i">
          <timeline-layer />
        </div>
        <!-- <div class="linehr" /> -->
        <div class="stips">
          <TimelineStrip
            v-for="(strip, j) in strips"
            ref="textLineComps"
            :key="j"
            :scale="scale"
            :strip="strip"
            :selected="isSelected(strip)"
            :layers="$refs.layers"
            :valid="getValid(strip)"
            :offset="scale * 10"
            @click="selectStrip(strip)"
            @changeStart="(v) => changeStart(j, v)"
            @submitStart="(v) => submitStart(j, v)"
            @changeLength="(v) => changeLength(j, v)"
            @changeLayer="(v) => changeLayer(j, v)"
          />
        </div>
        <timeline-out-area :offset="10" :scale="scale" />
        <timeline-out-area
          style="right: 0; left: auto"
          :offset="10"
          :scale="scale"
        />
      </div>
      <ContextMenu ref="contextMenu">
        <MenuButton @click="addText3DStrip">Add Text</MenuButton>
        <MenuButton @click="addVideoStrip">Add Video</MenuButton>
        <MenuButton @click="addAudioStrip">Add Audio</MenuButton>
        <MenuButton v-if="hasSelectedStrip" @click="split"> Split </MenuButton>
        <MenuButton v-if="hasSelectedStrip" @click="deleteStrip">
          Delete
        </MenuButton>
      </ContextMenu>
    </div>
  </div>
</template>

<style scoped>
.root {
  position: relative;
  height: 100%;
  border: 1px solid var(--black);
  /* -20px for window tag name */
  /* height: calc(100% - 20px); */
  height: 100%;
}
.timeline-container {
  overflow-x: scroll;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  height: calc(100% - 40px);
  overflow-y: hidden;
}
/* .timeline-container::-webkit-scrollbar {
  display: none;
} */

.timeline {
  position: relative;
  overflow-y: hidden;
  height: calc(100% - 20px);
}

.stips {
  position: absolute;
  top: 0px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, Watch } from "vue-property-decorator";
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
  VideoAsset,
  VideoStrip,
} from "~/models";
import ContextMenu from "~/components/vega/contextmenu/ContextMenu.vue";
import MenuButton from "~/components/vega/MenuButton.vue";
import { VegaError } from "~/plugins/error";

const RIGHT_MARGIN_SECONDS = 10;

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
export default class Timeline extends Vue {
  @Prop({ default: () => [] })
  strips!: Strip[];

  @Prop({ default: 0 })
  currentTime!: number;

  @Prop({ default: false })
  isPlay!: boolean;

  @Prop({ default: () => [] })
  selectedStrips!: Strip[];

  @Prop({ default: 0 })
  duration!: number;

  @Ref() scroll!: HTMLElement;

  @Ref() contextMenu!: ContextMenu;

  // pixels per second
  scale: number = 10;
  start: number = 0;

  minScale: number = 0;
  maxScale: number = 1000;

  get timeline() {
    return this.$refs.timeline as HTMLElement;
  }

  get seeklineStyle(): Partial<CSSStyleDeclaration> {
    const w = (this.duration + 10 + RIGHT_MARGIN_SECONDS) * this.scale;
    return {
      width: w + "px",
    };
  }

  get timelineStyle(): Partial<CSSStyleDeclaration> {
    const w = (this.duration + 10 + RIGHT_MARGIN_SECONDS) * this.scale;
    return {
      width: w + "px",
      maxWidth: w + "px",
    };
  }

  get hasSelectedStrip() {
    return this.selectedStrips.length > 0;
  }

  mounted() {
    this.updateMinScale();
    window.addEventListener("resize", () => {
      this.updateMinScale();
    });
  }

  @Watch("duration")
  updateMinScale() {
    this.minScale =
      this.$el.getBoundingClientRect().width / (this.duration + 20);
    if (this.scale < this.minScale) {
      this.scale = this.minScale;
    }
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
    this.contextMenu.close();
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
    this.contextMenu.close();
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
    this.contextMenu.close();
  }

  openContextMenu(e: MouseEvent) {
    this.contextMenu.open(e);
    e.preventDefault();
  }

  changeCurrentTime(time: number) {
    this.$emit("changeCurrentTime", time - 10);
    this.contextMenu.close();
  }

  upScale() {
    if (this.scale * 2 < this.maxScale) {
      this.scale *= 2;
      this.$nextTick(() => {
        this.scroll.scrollTo({
          left: this.scroll.scrollLeft + this.scroll.scrollWidth / 4,
        });
      });
    }
  }

  downScale() {
    if (this.scale * 0.5 < this.minScale) {
      this.scale = this.minScale;
    } else {
      this.scale *= 0.5;
      this.$nextTick(() => {
        this.scroll.scrollTo({
          left: this.scroll.scrollLeft * 0.5,
        });
      });
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
      if (self.end > ts && self.start < te && self.layer == t.layer) {
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

  changeStart(i: number, v: number) {
    this.$emit("changeStrip", i, "start", v);
  }

  submitStart(i: number) {
    if (!this.getValid(this.strips[i])) {
      (this.$refs as any).textLineComps[i].rollback();
    }
  }

  changeLayer(i: number, layer: number) {
    this.$emit("changeStrip", i, "layer", layer);
  }

  changeLength(i: number, v: number) {
    this.$emit("changeStrip", i, "length", v);
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
      this.changeLength(i, length);
      this.addStrip(newStrip);
    } else {
      throw new VegaError(
        `Split operations are not supported in ${target.type}.`
      );
    }
    this.contextMenu.close();
  }

  deleteStrip() {
    if (this.selectedStrips.length > 0) {
      this.deleteStripEmit(this.selectedStrips[0]);
    }
    this.contextMenu.close();
  }

  drop(e: DragEvent) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length == 1) {
      const file = files[0];
      const src = window.URL.createObjectURL(file);
      if (file.type == "video/mp4" || file.type == "video/webm") {
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
      } else if (
        file.type == "audio/wav" ||
        file.type == "audio/mp3" ||
        file.type == "audio/mpeg"
      ) {
        const asset = new AudioAsset(v4(), file.name, src);
        this.$emit("addAsset", asset);
        const newStrip = new AudioStrip(
          {
            start: this.currentTime,
            length: 5,
            layer: 0,
            id: "",
            type: "Video",
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

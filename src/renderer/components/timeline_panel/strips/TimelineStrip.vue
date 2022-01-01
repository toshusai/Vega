<template>
  <div
    class="timeline-strip"
    :class="rootClass"
    :style="lineStyle"
    @click="click"
    @pointerdown="dragStart"
  >
    <div :style="over" />
    <div class="strip">
      <component :is="stripComponentName" :strip="strip" :scale="scale" />
    </div>
    <div class="left-handle" @pointerdown="pdLeftHandle"></div>
    <div class="right-handle" @pointerdown="pdRightHandle"></div>
  </div>
</template>

<style scoped>
.timeline-strip {
  display: flex;
  position: absolute;
  cursor: pointer;
  height: 26px;
  overflow: hidden;
  white-space: nowrap;
  color: white;
  font-family: Ricty;
}

.timeline-strip--selected {
  z-index: 1;
}

.left-handle {
  position: absolute;
  width: 4px;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #00000088;
  cursor: ew-resize;
}

.right-handle {
  position: absolute;
  width: 4px;
  right: 0;
  top: 0;
  height: 100%;
  background-color: #00000088;
  cursor: ew-resize;
}

.strip {
  background-color: lightgreen;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border-radius: 2px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Text3DStrip from "./Text3DStrip.vue";
import TextStrip from "./TextStrip.vue";
import ImageStrip from "./ImageStrip.vue";
import VideoStrip from "./VideoStrip.vue";
import AudioStrip from "./AudioStrip.vue";
import { roundToFrame } from "~/plugins/utils/roundToFrame";
import { Strip } from "~/models";
import { addDragEventOnce } from "~/plugins/mouse";

@Component({
  components: {
    TextStrip,
    Text3DStrip,
    AudioStrip,
    VideoStrip,
    ImageStrip,
  },
})
export default class TimelineStrip extends Vue {
  @Prop()
  valid!: boolean;

  @Prop({})
  strip!: Strip;

  @Prop({ default: () => [] })
  layers!: HTMLElement[];

  @Prop({ default: 10 })
  scale!: number;

  @Prop({ default: false })
  selected!: boolean;

  @Prop({ default: 0 })
  offset!: number;

  @Prop({ default: 60 })
  fps!: number;

  @Prop({ default: 0 })
  timelineStart!: number;

  prev: any = { x: 0, y: 0 };
  start: any = { x: 0, y: 0 };
  tmpStart: any = 0;
  tmpLayer: any = 0;
  isDraging: any = false;
  mouseEnterEvents: any = [] as ((e: MouseEvent) => void)[];

  get rootClass() {
    return this.selected ? ["timeline-strip--selected"] : [];
  }

  get stripComponentName() {
    return this.strip.type + "Strip";
  }

  get lineStyle(): Partial<CSSStyleDeclaration> {
    const left = (this.strip.start - this.timelineStart) * this.scale;
    if (this.isDraging) {
      // left = this.tmpStart * 10;
    }
    return {
      left: `${this.offset + left}px`,
      width: `${this.strip.length * this.scale}px`,
      top: `${this.strip.layer * 31 + 3}px`,
      outline: this.selected ? `1px white solid` : "",
    };
  }

  get over(): Partial<CSSStyleDeclaration> {
    return {
      position: "absolute",
      width: `${this.strip.length * this.scale}px`,
      height: `30px`,
      outline: this.selected ? "1px solid white" : "",
      background: this.selected
        ? "rgba(255 255 255 / .2)"
        : this.valid
        ? ""
        : "rgba(255 0 0 / .2)",
    };
  }

  mounted() {
    for (let i = 0; i < this.layers.length; i++) {
      const tmp = i;
      const event = (_: MouseEvent) => {
        if (this.isDraging) {
          this.strip.layer = tmp;
        }
      };
      this.mouseEnterEvents.push(event);
    }

    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].addEventListener("mouseenter", this.mouseEnterEvents[i]);
    }
  }

  beforeDestroy() {
    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].removeEventListener(
        "mouseenter",
        this.mouseEnterEvents[i]
      );
    }
  }

  click(e: MouseEvent) {
    this.$emit("click", e);
  }

  drag(e: MouseEvent) {
    this.prev.x = e.pageX;
    this.prev.y = e.pageY;
    const t = this.tmpStart + (e.pageX - this.start.x) / this.scale;
    const rt = roundToFrame(t, this.fps);
    this.$emit("changeStart", rt);
  }

  update() {
    this.$emit("changeLength", this.strip.length);
  }

  dragStart(e: MouseEvent) {
    this.$emit("click", e);
    this.prev.x = e.pageX;
    this.prev.y = e.pageY;
    this.start.x = e.pageX;
    this.start.y = e.pageY;
    this.tmpStart = this.strip.start;
    this.tmpLayer = this.strip.layer;
    this.isDraging = true;
    document.body.addEventListener("mousemove", this.drag);
    const pu = (_: MouseEvent) => {
      this.isDraging = false;
      this.$emit("submitStart", this.strip.start);
      document.body.removeEventListener("mousemove", this.drag);
      document.body.removeEventListener("pointerup", pu);
    };
    document.body.addEventListener("pointerup", pu);
  }

  rollback() {
    this.strip.layer = this.tmpLayer;
    this.$emit("changeStart", this.tmpStart);
  }

  pdLeftHandle(e: MouseEvent) {
    e.stopPropagation();
    const startX = e.pageX;
    const startL = this.strip.length;
    const startS = this.strip.start;
    addDragEventOnce((e) => {
      const d = (e.pageX - startX) / this.scale;
      this.$emit("changeStart", roundToFrame(startS + d, this.fps));
      this.$emit("changeLength", roundToFrame(startL - d, this.fps));
    });
  }

  pdRightHandle(e: MouseEvent) {
    e.stopPropagation();
    const startX = e.pageX;
    const startL = this.strip.length;
    addDragEventOnce((e) => {
      let newL = (e.pageX - startX) / this.scale;
      newL += startL;
      this.$emit("changeLength", roundToFrame(newL, this.fps));
    });
  }
}
</script>

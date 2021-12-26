<template>
  <div
    ref="root"
    class="seekline"
    @pointerdown="movePos"
    @pointerup="pointerUp"
    @pointermove="mousemove"
    @pointerleave="mouseleave"
  >
    <div v-for="(s, i) in array" :key="i" :style="getTimesStyle(s)">
      <div class="text">
        {{ timeView(s) }}
        <div class="time-bar"></div>
      </div>
    </div>
    <Seekbar :offset="offset" :pos="pos - start" :scale="scale" />
  </div>
</template>

<style scoped>
.seekline {
  height: 20px;
  background-color: #f9f9f9;
  cursor: pointer;
  width: 100%;
}

.text {
  position: relative;
  padding-left: 4px;
  color: gray;
}

.time-bar {
  top: 0;
  left: 0;
  width: 1px;
  background-color: #ccc;
  height: 20px;
  position: absolute;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, Watch } from "vue-property-decorator";
import { roundToFrame } from "../../plugins/utils/roundToFrame";
import Seekbar from "./TimelineSeekbar.vue";

const TIME_TEXT_MAX_WIDTH = 100;

@Component({
  components: {
    Seekbar,
  },
})
export default class TimelineSeekline extends Vue {
  @Prop({ default: 100 }) scale!: number;
  @Prop({ default: 0 }) pos!: number;
  @Prop({ default: 1 }) length!: number;
  @Prop({ default: 0 }) offset!: number;
  @Prop({ default: 60 }) fps!: number;
  @Prop({ default: 0 }) start!: number;
  @Ref() root!: HTMLElement;

  isDrag: any = false;

  get offsetSeconds() {
    return this.offset / this.scale;
  }

  get array(): number[] {
    const a = [];
    const s = TIME_TEXT_MAX_WIDTH / this.scale;
    const l = Math.floor(this.start / s);
    const ss = s * l;

    for (
      let x = 0;
      x < this.showLength;
      x += TIME_TEXT_MAX_WIDTH / this.scale
    ) {
      a.push(ss + x);
    }
    return a;
  }

  get step() {
    return 1 / this.fps;
  }

  /**
   * The length seconds to render
   */
  showLength = 0;

  mounted() {
    this.updateShowLength();
  }

  @Watch("scale")
  updateShowLength() {
    const rect = this.root.getBoundingClientRect();
    const length = rect.width / this.scale;
    this.showLength = length;
  }

  timeView(s: number) {
    if (s < 0) {
      return "-" + new Date(-s * 1000).toISOString().substr(11, 8);
    }
    return new Date(s * 1000).toISOString().substr(11, 12);
  }

  getTimesStyle(s: number): Partial<CSSStyleDeclaration> {
    return {
      left: this.scale * (s - this.start) + "px",
      position: "absolute",
      pointerEvents: "none",
      fontSize: "10px",
    };
  }

  movePos(e: MouseEvent) {
    this.$emit(
      "changePos",
      roundToFrame(this.start + e.offsetX / this.scale, this.fps) + 0.0001
    );
    this.isDrag = true;
  }

  mousemove(e: MouseEvent) {
    if (this.isDrag) {
      this.$emit(
        "changePos",
        roundToFrame(this.start + e.offsetX / this.scale, this.fps) + 0.0001
      );
    }
  }

  pointerUp() {
    this.isDrag = false;
  }

  mouseleave() {
    this.isDrag = false;
  }
}
</script>

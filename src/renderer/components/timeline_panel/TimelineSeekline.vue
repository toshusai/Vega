<template>
  <div
    class="seekline"
    @pointerdown="movePos"
    @pointerup="pointerUp"
    @pointermove="mousemove"
    @pointerleave="mouseleave"
  >
    <div v-for="(s, i) in array" :key="i" :style="timesStyle[i]">
      <div class="text">
        {{ timeView(s) }}
        <div class="time-bar"></div>
      </div>
    </div>
    <Seekbar :offset="offset" :pos="pos" :scale="scale" />
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
import { Component, Prop } from "vue-property-decorator";
import { roundToFrame } from "../../plugins/utils/roundToFrame";
import Seekbar from "./TimelineSeekbar.vue";

const TIME_TEXT_INTERVAL_RATE = 100;

@Component({
  components: {
    Seekbar,
  },
})
export default class TimelineSeekline extends Vue {
  @Prop({ default: 100 })
  scale!: number;

  @Prop({ default: 0 })
  pos!: number;

  @Prop({ default: 1 })
  length!: number;

  @Prop({ default: 0 })
  offset!: number;

  @Prop({ default: 60 })
  fps!: number;

  isDrag: any = false;

  get offsetSeconds() {
    return this.offset / this.scale;
  }

  get interval() {
    return Math.round(TIME_TEXT_INTERVAL_RATE / this.scale) || 1;
  }

  get secArray(): number[] {
    const array = [
      ...Array(Math.ceil(this.length + this.offset / this.scale + 1)),
    ].map((_, i) => i + 1 - this.offsetSeconds);
    return array;
  }

  get array() {
    const result = this.secArray.filter((s: number) => {
      return s % this.interval == 0;
    });
    return result;
  }

  get step() {
    return 1 / this.fps;
  }

  timeView(s: number) {
    if (s < 0) {
      return "-" + new Date(-s * 1000).toISOString().substr(11, 8);
    }
    return new Date(s * 1000).toISOString().substr(11, 8);
  }

  get timesStyle(): Partial<CSSStyleDeclaration>[] {
    return this.array.map((s: number) => {
      return {
        left: this.scale * (s + this.offsetSeconds) + "px",
        position: "absolute",
        pointerEvents: "none",
        fontSize: "10px",
      };
    });
  }

  movePos(e: MouseEvent) {
    this.$emit("changePos", roundToFrame(e.offsetX / this.scale, this.fps));
    this.isDrag = true;
  }

  mousemove(e: MouseEvent) {
    if (this.isDrag) {
      this.$emit("changePos", roundToFrame(e.offsetX / this.scale, this.fps));
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

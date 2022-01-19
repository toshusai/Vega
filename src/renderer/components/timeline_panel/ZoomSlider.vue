<template>
  <div class="slider">
    <div :style="style" class="slider-handle" @pointerdown="pointerdown"></div>
  </div>
</template>

<style scoped>
.slider {
  height: 16px;
  background-color: lightgrey;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.slider-handle {
  position: absolute;
  background-color: grey;
  height: 12px;
  border-radius: 8px;
  top: 2px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";
import { addDragEventOnce } from "~/plugins/mouse";

@Component({})
export default class ZoomSlider extends Vue {
  @PropSync("startSync", { default: 0 })
  start!: number;

  @PropSync("durationSync", { default: 0 })
  duration!: number;

  @PropSync("scaleSync", { default: 0 })
  scale!: number;

  @PropSync("showLengthSync", { default: 0 })
  showLength!: number;

  /**
   * margin for timeline
   */
  margin = 3;

  get style() {
    const el = this.$el as HTMLElement;
    // Add margin to start and end.
    const duration = this.duration + this.margin * 2;
    const width = this.showLength / duration;

    if (!el) return {};
    const sliderWidth = el.getBoundingClientRect().width;

    return {
      width: width * sliderWidth + "px",
      left: ((this.start + this.margin) / duration) * sliderWidth + "px",
    };
  }

  pointerdown(e: MouseEvent) {
    const startXPx = e.pageX;
    const startSec = this.start;
    addDragEventOnce((e) => {
      const el = this.$el as HTMLElement;
      if (!el) return { width: 0 };
      const sliderWidth = el.getBoundingClientRect().width;
      // sec space to sliderPx space
      const sliderScale = sliderWidth / (this.duration + this.margin * 2);
      const currentXPx = e.pageX;
      const deltaPx = currentXPx - startXPx;
      this.start = startSec + deltaPx / sliderScale;
    });
  }
}
</script>

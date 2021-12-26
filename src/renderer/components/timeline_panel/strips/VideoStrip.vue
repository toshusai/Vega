<template>
  <div data-vega-video-strip class="video-strip">
    <canvas ref="waveCanvas" class="wave" :width="canvasWidth" height="26" />
    <span v-if="strip.videoAsset">
      {{ strip.videoAsset.name }}
    </span>
    <strip-error v-if="!strip.loaded" />
  </div>
</template>

<style scoped>
.video-strip {
  width: 100%;
  height: 100%;
  background: var(--strip-video);
  font-size: 12px;
}

.wave {
  width: 100%;
  position: absolute;
  background-color: var(--blue);
  top: 0;
  left: 0;
}

/* Override wavesurfer overflow because scroll bar is appeared */
.wave >>> wave {
  overflow: hidden !important;
  z-index: 0;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, Watch } from "vue-property-decorator";
import WaveSufer from "wavesurfer.js";
import { VideoStrip } from "../../../models";
import StripError from "./StripError.vue";

@Component({
  name: "VideoStrip",
  components: {
    StripError,
  },
})
export default class VideoStripComp extends Vue {
  @Prop({ default: () => null })
  strip!: VideoStrip;

  @Prop({ default: 10 })
  scale!: number;

  @Ref() waveCanvas!: HTMLCanvasElement;

  ctx!: CanvasRenderingContext2D;

  wave: any = null as WaveSufer | null;

  waveStyle: Partial<CSSStyleDeclaration> = {};

  /**
   * cancel for animation frame
   */
  cancel: number = 0;

  get canvasWidth() {
    return this.strip.length * this.scale;
  }

  @Watch("strip.videoOffset")
  @Watch("strip.videoDuration")
  watchViodeOffset() {
    this.waveStyle = {
      left: -this.strip.videoOffset * this.scale + "px",
      width: this.strip.videoDuration * this.scale + "px",
    };
    // zoom depend on dom width
    this.$nextTick(() => {
      this.wave?.zoom(this.scale);
    });
  }

  @Watch("scale")
  scaleWatch(newScale: number) {
    this.waveStyle = {
      left: -this.strip.videoOffset * newScale + "px",
      width: this.strip.videoDuration * newScale + "px",
    };
    // zoom depend on dom width
    this.$nextTick(() => {
      this.wave?.zoom(newScale);
    });
  }

  mounted() {
    this.ctx = this.waveCanvas.getContext("2d") as CanvasRenderingContext2D;
    this.watchViodeOffset();
    this.update();
  }

  update() {
    const srcX = this.strip.videoOffset * 10 * 2;
    const c = this.strip.videoAsset?.getcanvas(srcX);

    if (c) {
      this.ctx.clearRect(0, 0, this.waveCanvas.width, this.waveCanvas.height);
      this.ctx.drawImage(
        c,
        this.strip.videoAsset?.getSrcX(srcX) || 0,
        0,
        this.strip.length * 10 * 2,
        26,
        0,
        0,
        this.canvasWidth,
        26
      );
    }
    this.cancel = window.requestAnimationFrame(this.update);
  }

  beforeDestroy() {
    if (this.cancel !== 0) {
      window.cancelAnimationFrame(this.cancel);
    }
  }
}
</script>

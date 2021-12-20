<template>
  <div data-vega-video-strip class="video-strip">
    <div ref="wave" class="wave" :style="waveStyle" />
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
import { Component, Prop, Watch } from "vue-property-decorator";
import WaveSufer from "wavesurfer.js";
import StripError from "./StripError.vue";
import { VideoStrip } from "~/models";

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

  wave: any = null as WaveSufer | null;

  waveStyle: Partial<CSSStyleDeclaration> = {};

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

  @Watch("strip")
  stripWatch(_n: VideoStrip) {
    // TODO fix
    // this is too slow when many strips.
    // this.wave?.load(n.video);
  }

  updateStrip() {
    // this.stripWatch(this.strip);
  }

  mounted() {
    this.wave = WaveSufer.create({
      container: this.$refs.wave as HTMLElement,
      height: 26,
      waveColor: "#ff9800",
      interact: false,
    });

    // this.wave.load(this.strip.video);

    this.strip.event.addEventListener("update", this.updateStrip);
    this.watchViodeOffset();
  }

  beforeDestroy() {
    this.strip.event.removeEventListener("update", this.updateStrip);
  }
}
</script>

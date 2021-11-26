<template>
  <div data-vega-strip-inspector-window class="strip-inspector">
    <component
      :is="comp"
      v-if="strip"
      :stripSync.sync="strip"
      :assets="assets"
      @change="change"
    />
  </div>
</template>

<style scoped>
.strip-inspector {
  box-sizing: border-box;
  height: 100%;
  overflow-y: scroll;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import VideoStripInspector from "./VideoStripInspector.vue";
import Text3DStripInspector from "./Text3DStripInspector.vue";
import AudioStripInspector from "./AudioStripInspector.vue";
import TextStripInspector from "./TextStripInspector.vue";
import ImageStripInspector from "./ImageStripInspector.vue";
import WindowNameTag from "~/components/vega/WindowNameTag.vue";
import { Asset, Strip } from "~/models";

@Component({
  components: {
    TextStripInspector,
    VideoStripInspector,
    Text3DStripInspector,
    AudioStripInspector,
    ImageStripInspector,
    WindowNameTag,
  },
})
export default class StripInspectorWindow extends Vue {
  @PropSync("stripSync") strip!: Strip;

  @Prop({ default: () => [] })
  assets!: Asset[];

  get comp() {
    return `${this.strip.type}StripInspector`;
  }

  change(strip: Strip) {
    this.$emit("change", strip);
  }
}
</script>

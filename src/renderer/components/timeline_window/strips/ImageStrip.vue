<template>
  <div data-vega-text-strip class="image-strip">
    <span v-if="strip.imageAsset">
      <img class="image-preview" :src="strip.imageAsset.path" />
      <div class="preview-name">
        {{ strip.imageAsset.name }}
      </div>
    </span>
    <strip-error v-if="!strip.imageAsset" />
  </div>
</template>

<style scoped>
.image-strip {
  background-color: var(--strip-image);
  width: 100%;
  height: 100%;
  user-select: none;
  /* for left handle */
  padding-left: 4px;
}

.image-preview {
  pointer-events: none;
  height: 24px;
  position: absolute;
  left: 5px;
  top: 1px;
}

.preview-name {
  pointer-events: none;
  margin-left: 26px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import StripError from "./StripError.vue";
import { ImageStrip } from "~/models";

@Component({
  components: {
    StripError,
  },
})
export default class ImageStripComp extends Vue {
  @Prop({ default: () => undefined })
  strip!: ImageStrip;
}
</script>

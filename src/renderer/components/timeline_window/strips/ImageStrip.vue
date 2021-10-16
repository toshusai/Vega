<template>
  <div data-vega-text-strip class="text-strip">
    <span v-if="strip.imageAsset">
      {{ strip.imageAsset.name }}
    </span>
    <div v-if="!strip.imageAsset" class="error">
      [Error] Image Resouce Not Found
    </div>
  </div>
</template>

<style scoped>
.text-strip {
  background-color: var(--lime-700);
  width: 100%;
  height: 100%;
  user-select: none;
  /* for left handle */
  padding-left: 4px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ImageStrip } from "~/models";

@Component({})
export default class ImageStripComp extends Vue {
  @Prop({ default: () => undefined })
  strip!: ImageStrip;
}
</script>

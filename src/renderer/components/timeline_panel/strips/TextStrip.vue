<template>
  <div data-vega-text-strip class="text-strip">
    {{ strip.text }}
  </div>
</template>

<style scoped>
.text-strip {
  background-color: var(--strip-text);
  width: 100%;
  height: 100%;
  user-select: none;
  /* for left handle */
  padding-left: 6px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { TextStrip } from "~/models";

@Component({})
export default class TextStripComp extends Vue {
  @Prop({ default: () => undefined })
  strip!: TextStrip;
}
</script>

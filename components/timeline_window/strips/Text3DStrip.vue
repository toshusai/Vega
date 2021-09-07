<template>
  <div data-vega-text-strip class="text-strip">
    {{ strip.text }}
  </div>
</template>

<style scoped>
.text-strip {
  background-color: var(--green);
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
import { Text3DStrip } from "~/models";

@Component({})
export default class Text3DStripComp extends Vue {
  @Prop({ default: () => undefined })
  strip!: Text3DStrip;
}
</script>

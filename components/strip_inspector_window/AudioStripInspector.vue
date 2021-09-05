<template>
  <div style="padding: 4px">
    <div class="label">Start</div>
    <div>{{ strip.start.toFixed(2) }}</div>

    <div class="label">Length</div>
    <div>{{ strip.length.toFixed(2) }}</div>

    <div class="label">Src</div>
    <div>{{ strip.src }}</div>
  </div>
</template>

<style scoped>
.label {
  font-weight: bold;
  margin-top: 8px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Asset, AudioStrip } from "~/models";

@Component({})
export default class AudioStripInspector extends Vue {
  @Prop({ default: () => null })
  strip!: AudioStrip;

  @Prop({ default: () => [] })
  assets!: Asset[];
}
</script>

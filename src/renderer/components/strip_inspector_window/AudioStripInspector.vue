<template>
  <div style="padding: 4px">
    <div class="label">Start</div>
    <div>WIP</div>

    <div class="label">Length</div>
    <div>WIP</div>

    <div class="label">Src</div>
    <div>WIP</div>

    <div class="label">Asset</div>
    <div>WIP</div>
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

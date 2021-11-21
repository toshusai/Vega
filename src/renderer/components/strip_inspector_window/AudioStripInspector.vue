<template>
  <div style="padding: 4px">
    <sp-field-label> Start </sp-field-label>
    <sp-textfield
      size="S"
      type="number"
      :step="0.01"
      :value="strip.start"
      @change="changeStart"
    />

    <sp-field-label> Offset </sp-field-label>
    <sp-textfield
      size="S"
      type="number"
      :step="0.01"
      :value="strip.videoOffset"
      @change="changeVideoOffset"
    />

    <sp-field-label>Length</sp-field-label>
    <sp-textfield
      size="S"
      type="number"
      :step="0.01"
      :value="strip.length"
      @change="changeLength"
    />

    <sp-field-label>Video</sp-field-label>
    <VegaSelect
      :items="selectItems"
      :value="currentAssetId"
      @change="changeSrc"
    />
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

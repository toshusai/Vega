<template>
  <div style="padding: 4px">
    <sp-field-label> Start </sp-field-label>
    <sp-textfield v-model="strip.start" size="S" type="number" :step="0.01" />

    <sp-field-label> Offset </sp-field-label>
    <sp-textfield
      v-model="strip.videoOffset"
      size="S"
      type="number"
      :step="0.01"
    />

    <sp-field-label>Length</sp-field-label>
    <sp-textfield v-model="strip.length" size="S" type="number" :step="0.01" />

    <sp-field-label>Audio</sp-field-label>
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
import { Component, Prop, PropSync } from "vue-property-decorator";
import { OptionKeyValue } from "../vega/VegaSelect.vue";
import { Asset, AudioStrip, AudioAsset } from "~/models";
import VegaSelect from "~/components/vega/VegaSelect.vue";

@Component({
  components: {
    VegaSelect,
  },
})
export default class AudioStripInspector extends Vue {
  @PropSync("stripSync") strip!: AudioStrip;

  @Prop({ default: () => [] }) assets!: Asset[];

  get currentAssetId() {
    return this.strip.asset?.id;
  }

  get audioAssets(): AudioAsset[] {
    return this.assets.filter((a) => a instanceof AudioAsset) as AudioAsset[];
  }

  get selectItems() {
    const items: OptionKeyValue[] = [
      { value: "", text: "No selected", disabled: true },
    ];
    return items.concat(
      this.audioAssets.map((va: AudioAsset) => {
        return {
          value: va.id,
          text: va.name,
        };
      })
    );
  }

  changeSrc(e: OptionKeyValue) {
    const targetAsset = this.assets.find((a) => a.id == e.value);
    if (!targetAsset || !(targetAsset instanceof AudioAsset)) return;
    this.strip.updateAsset(targetAsset);
  }
}
</script>

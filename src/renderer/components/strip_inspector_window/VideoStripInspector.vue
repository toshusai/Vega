<template>
  <div style="padding: 4px">
    <sp-field-label>
      Video
      <sp-icon name="VideoOutline" style="width: 12px" />
    </sp-field-label>
    <VegaSelect
      v-model="currentAssetId"
      :items="selectItems"
      @change="changeSrc"
    />

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

    <sp-field-label>Position</sp-field-label>
    <div style="display: flex">
      <div>
        <sp-field-label>X</sp-field-label>
        <sp-textfield
          v-model="strip.position.x"
          size="S"
          type="number"
          style="width: 100%"
        />
      </div>
      <div>
        <sp-field-label>Y</sp-field-label>
        <sp-textfield
          v-model="strip.position.y"
          size="S"
          style="width: 100%"
          type="number"
        />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import { OptionKeyValue } from "../vega/VegaSelect.vue";
import { Asset, VideoAsset, VideoStrip } from "~/models";
import VegaSelect from "~/components/vega/VegaSelect.vue";

@Component({
  components: {
    VegaSelect,
  },
})
export default class VideoStripInspector extends Vue {
  @PropSync("stripSync") strip!: VideoStrip;

  @Prop({ default: () => [] }) assets!: Asset[];

  get currentAssetId() {
    return this.strip.videoAsset?.id;
  }

  get videoAssets(): VideoAsset[] {
    return this.assets.filter((a) => a instanceof VideoAsset) as VideoAsset[];
  }

  get selectItems() {
    const items: OptionKeyValue[] = [{ value: "", text: "" }];
    return items.concat(
      this.videoAssets.map((va: VideoAsset) => {
        return {
          value: va.id,
          text: va.name,
        };
      })
    );
  }

  changePropertyEmit(name: string, value: any) {
    this.$emit("changeProperty", name, value);
  }

  changeVideoOffset(v: number) {
    this.changePropertyEmit("videoOffset", v);
  }

  changeStart(start: number) {
    this.changePropertyEmit("start", start);
  }

  changeLength(length: number) {
    this.changePropertyEmit("length", length);
  }

  changeSrc(e: OptionKeyValue) {
    const targetAsset = this.assets.find((a) => a.id == e.value);
    if (!targetAsset || !(targetAsset instanceof VideoAsset)) return;
    this.strip.updateAsset(targetAsset);
  }

  changeX(value: number) {
    this.changePropertyEmit("position.x", value);
  }

  changeY(value: number) {
    this.changePropertyEmit("position.y", value);
  }
}
</script>

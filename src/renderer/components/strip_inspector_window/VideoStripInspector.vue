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

    <sp-field-label>Position</sp-field-label>
    <div style="display: flex">
      <div>
        <sp-field-label>X</sp-field-label>
        <sp-textfield
          size="S"
          type="number"
          style="width: 100%"
          :value="strip.position.x"
          @change="changeX"
        />
      </div>
      <div>
        <sp-field-label>Y</sp-field-label>
        <sp-textfield
          size="S"
          style="width: 100%"
          type="number"
          :value="strip.position.y"
          @change="changeY"
        />
      </div>
    </div>

    <sp-field-label>Video</sp-field-label>
    <VegaSelect
      :items="selectItems"
      :value="currentAssetId"
      @change="changeSrc"
    />
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { OptionKeyValue } from "../vega/VegaSelect.vue";
import { Asset, VideoAsset, VideoStrip } from "~/models";
import VegaSelect from "~/components/vega/VegaSelect.vue";

@Component({
  components: {
    VegaSelect,
  },
})
export default class VideoStripInspector extends Vue {
  @Prop({})
  strip!: VideoStrip;

  @Prop({ default: () => [] })
  assets!: Asset[];

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

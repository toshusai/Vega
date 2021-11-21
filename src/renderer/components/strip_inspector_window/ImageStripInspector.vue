<template>
  <div style="padding: 4px">
    <sp-field-label>Image</sp-field-label>
    <VegaSelect
      :items="selectItems"
      :value="currentAssetId"
      @change="changeSrc"
    />
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
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import VegaSelect, { OptionKeyValue } from "../vega/VegaSelect.vue";
import { Asset, ImageStrip, ImageAsset } from "~/models";

@Component({
  components: {
    VegaSelect,
  },
})
export default class ImageStripInspector extends Vue {
  @Prop({})
  strip!: ImageStrip;

  @Prop({ default: () => [] })
  assets!: Asset[];

  get currentAssetId() {
    return this.strip.imageAsset?.id;
  }

  get videoAssets(): ImageAsset[] {
    return this.assets.filter((a) => a instanceof ImageAsset) as ImageAsset[];
  }

  get selectItems() {
    const items: OptionKeyValue[] = [{ value: "", text: "" }];
    return items.concat(
      this.videoAssets.map((va: ImageAsset) => {
        return {
          value: va.id,
          text: va.name,
        };
      })
    );
  }

  changeEmit(strip: ImageStrip) {
    this.$emit("change", strip);
  }

  changePropertyEmit(name: string, value: any) {
    this.$emit("changeProperty", name, value);
  }

  changeStripText(text: string) {
    this.changePropertyEmit("text", text);
  }

  changeStart(start: number) {
    this.changePropertyEmit("start", start);
  }

  changeLength(length: number) {
    this.changePropertyEmit("length", length);
  }

  changeX(x: number) {
    this.changePropertyEmit("position.x", x);
  }

  changeY(y: number) {
    this.changePropertyEmit("position.y", y);
  }

  changeSrc(e: OptionKeyValue) {
    const targetAsset = this.assets.find((a) => a.id == e.value);
    if (!targetAsset || !(targetAsset instanceof ImageAsset)) return;
    this.strip.updateAsset(targetAsset);
  }
}
</script>

<template>
  <div style="padding: 4px">
    <div class="label">Start</div>
    <VegaValueInput
      type="number"
      :step="0.01"
      :value="strip.start.toFixed(3)"
      @change="changeStart"
    />

    <hr class="hr" />

    <div class="label">Length</div>
    <VegaValueInput
      type="number"
      :step="0.01"
      :value="strip.length.toFixed(3)"
      @change="changeLength"
    />

    <hr class="hr" />

    <div class="label">Position</div>
    <div class="position">
      x:<VegaValueInput
        type="number"
        :step="0.01"
        :value="strip.position.x"
        @change="changeX"
      />
    </div>
    <div class="position">
      y:<VegaValueInput
        type="number"
        :step="0.01"
        :value="strip.position.y"
        @change="changeY"
      />
    </div>

    <hr class="hr" />

    <div class="label">Asset</div>
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
}

.position {
  display: flex;
}

.hr {
  height: 1px;
  box-sizing: border-box;
  margin: 8px 0;
  padding: 0;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import VegaInput from "../vega/VegaInput.vue";
import VegaSelect, { OptionKeyValue } from "../vega/VegaSelect.vue";
import { Asset, ImageStrip, ImageAsset } from "~/models";
import VegaValueInput from "~/components/vega/VegaValueInput.vue";

@Component({
  components: {
    VegaInput,
    VegaSelect,
    VegaValueInput,
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

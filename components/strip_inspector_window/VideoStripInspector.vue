<template>
  <div style="padding: 4px">
    <div class="label">Start</div>
    <VegaValueInput
      type="number"
      :step="0.01"
      :value="strip.start"
      @change="changeStart"
    />

    <hr class="hr" />

    <div class="label">Offset</div>
    <VegaValueInput
      type="number"
      :step="0.01"
      :value="strip.videoOffset"
      @change="changeVideoOffset"
    />

    <hr class="hr" />

    <div class="label">Length</div>
    <VegaValueInput
      type="number"
      :step="0.01"
      :value="strip.length"
      @change="changeLength"
    />

    <hr class="hr" />

    <div class="label">Position</div>
    <div class="position">
      x:<VegaValueInput
        type="number"
        :value="strip.position.x"
        @change="changeX"
      />
    </div>
    <div class="position">
      y:<VegaValueInput
        type="number"
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
  margin: 2px 0;
  padding: 0;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { OptionKeyValue } from "../vega/VegaSelect.vue";
import { Asset, VideoAsset, VideoStrip } from "~/models";

@Component({})
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

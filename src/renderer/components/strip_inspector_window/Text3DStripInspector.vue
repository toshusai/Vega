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

    <div class="label">Text</div>
    <VegaValueInput :value="strip.text" @change="changeStripText" />

    <hr class="hr" />

    <div class="label">Asset</div>
    <VegaSelect :items="selectItems" :value="strip.fontAssetId" />
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
import VegaSelect from "../vega/VegaSelect.vue";
import { Asset, FontAsset, Text3DStrip } from "~/models";
import { IText3DStrip } from "~/models/strips";
import VegaValueInput from "~/components/vega/VegaValueInput.vue";

@Component({
  components: {
    VegaInput,
    VegaSelect,
    VegaValueInput,
  },
})
export default class Text3DStripInspector extends Vue {
  @Prop({})
  strip!: Text3DStrip;

  @Prop({ default: () => [] })
  assets!: Asset[];

  get fontAssets() {
    return this.assets.filter((a) => a instanceof FontAsset);
  }

  get selectItems() {
    return this.fontAssets
      .map((va: FontAsset) => {
        return {
          value: va.id,
          text: va.name,
        };
      })
      .concat({
        value: FontAsset.defaultFont.id,
        text: FontAsset.defaultFont.name,
      });
  }

  changeEmit(strip: Text3DStrip) {
    this.$emit("change", strip);
  }

  changePropertyEmit(name: string, value: any) {
    this.$emit("changeProperty", name, value);
  }

  change(update: (iface: IText3DStrip) => void) {
    const iface = this.strip.toInterface();
    update(iface);
    const ts = Text3DStrip.create(iface, this.strip.font);
    this.changeEmit(ts);
  }

  // TODO Change update methods for improve performance
  // Update only the properties instead of creating a new instance
  changeStripText(text: string) {
    this.change((iface) => {
      iface.text = text;
    });
  }

  changeFont() {}

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
}
</script>

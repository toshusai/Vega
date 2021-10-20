<template>
  <div style="padding: 4px">
    <div class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">Text</div>
    <VegaValueInput
      class="w100"
      :value="strip.text"
      @change="changeStripText"
    />

    <div class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">Start</div>
    <VegaValueInput
      class="w100"
      type="number"
      :step="0.01"
      :value="strip.start.toFixed(3)"
      @change="changeStart"
    />

    <div class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">Length</div>
    <VegaValueInput
      class="w100"
      type="number"
      :step="0.01"
      :value="strip.length.toFixed(3)"
      @change="changeLength"
    />

    <div class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">Position</div>
    <div class="position">
      <div>
        <div class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">Y</div>
        <VegaValueInput
          type="number"
          class="w100"
          :step="0.01"
          :value="strip.position.x"
          @change="changeX"
        />
      </div>
      <div>
        <div class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">X</div>
        <VegaValueInput
          class="w100"
          type="number"
          :step="0.01"
          :value="strip.position.y"
          @change="changeY"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.label {
  font-weight: bold;
}

.w100 {
  width: 100%;
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
import { Asset } from "~/models";
import { ITextStrip, TextStrip } from "~/models/strips";
import VegaValueInput from "~/components/vega/VegaValueInput.vue";

@Component({
  components: {
    VegaValueInput,
    VegaInput,
    VegaSelect,
  },
})
export default class TextStripInspector extends Vue {
  @Prop({})
  strip!: TextStrip;

  @Prop({ default: () => [] })
  assets!: Asset[];

  changeEmit(strip: TextStrip) {
    this.$emit("change", strip);
  }

  changePropertyEmit(name: string, value: any) {
    this.$emit("changeProperty", name, value);
  }

  change(update: (iface: ITextStrip) => void) {
    const iface = this.strip.toInterface();
    update(iface);
    const ts = new TextStrip(iface);
    this.changeEmit(ts);
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
}
</script>

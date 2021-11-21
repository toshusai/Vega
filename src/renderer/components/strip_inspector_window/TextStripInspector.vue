<template>
  <div style="padding: 4px">
    <sp-field-label> Text </sp-field-label>
    <sp-textfield
      size="S"
      class="w100"
      :value="strip.text"
      @change="changeStripText"
    />

    <sp-field-label> Start</sp-field-label>
    <sp-textfield
      size="S"
      class="w100"
      type="number"
      :step="0.01"
      :value="strip.start.toFixed(3)"
      @change="changeStart"
    />

    <sp-field-label>Length</sp-field-label>
    <sp-textfield
      size="S"
      class="w100"
      type="number"
      :step="0.01"
      :value="strip.length.toFixed(3)"
      @change="changeLength"
    />

    <sp-field-label>Position</sp-field-label>
    <div class="position">
      <div>
        <sp-field-label>X</sp-field-label>
        <sp-textfield
          size="S"
          type="number"
          class="w100"
          :step="0.01"
          :value="strip.position.x"
          @change="changeX"
        />
      </div>
      <div>
        <sp-field-label>Y</sp-field-label>
        <sp-textfield
          size="S"
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
import { Component, Prop, PropSync } from "vue-property-decorator";
import VegaSelect from "../vega/VegaSelect.vue";
import { Asset } from "~/models";
import { TextStrip } from "~/models/strips";

@Component({
  components: {
    VegaSelect,
  },
})
export default class TextStripInspector extends Vue {
  @PropSync("stripSync")
  strip!: TextStrip;

  @Prop({ default: () => [] })
  assets!: Asset[];

  changeStripText(text: string) {
    this.strip.text = text;
  }

  changeStart(start: number) {
    this.strip.start = start;
  }

  changeLength(length: number) {
    this.strip.length = length;
  }

  changeX(x: number) {
    this.strip.position.x = x;
  }

  changeY(y: number) {
    this.strip.position.y = y;
  }
}
</script>

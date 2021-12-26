<template>
  <div style="padding: 4px">
    <sp-field-label>
      Text
      <sp-icon name="Text" style="width: 12px" />
    </sp-field-label>
    <sp-textfield v-model="strip.text" size="S" class="w100" />

    <sp-field-label> Start</sp-field-label>
    <sp-textfield
      v-model="strip.start"
      size="S"
      class="w100"
      type="number"
      :step="0.01"
    />

    <sp-field-label>Length</sp-field-label>
    <sp-textfield
      v-model="strip.length"
      size="S"
      class="w100"
      type="number"
      :step="0.01"
    />

    <sp-field-label>Family</sp-field-label>
    <sp-textfield v-model="strip.fontFamily" size="S" class="w100" />

    <sp-field-label>Style</sp-field-label>
    <sp-textfield v-model="strip.fontStyle" size="S" class="w100" />

    <sp-field-label>Size</sp-field-label>
    <sp-textfield
      v-model="strip.fontSize"
      size="S"
      class="w100"
      type="number"
      @change="() => strip.updateFont()"
    />

    <sp-field-label>Color</sp-field-label>
    <sp-textfield v-model="strip.color" size="S" class="w100" />

    <sp-field-label>Shadow Color</sp-field-label>
    <sp-textfield v-model="strip.shadowColor" size="S" class="w100" />

    <sp-field-label>Shadow Blur</sp-field-label>
    <sp-textfield
      v-model="strip.shadowBlur"
      size="S"
      class="w100"
      type="number"
    />

    <sp-field-label>Outline Color</sp-field-label>
    <sp-textfield v-model="strip.outlineColor" size="S" class="w100" />

    <sp-field-label>Outline Size</sp-field-label>
    <sp-textfield
      v-model="strip.outlineSize"
      size="S"
      class="w100"
      type="number"
    />

    <sp-field-label>Position</sp-field-label>
    <div class="position">
      <div>
        <sp-field-label>X</sp-field-label>
        <sp-textfield
          v-model="strip.position.x"
          size="S"
          type="number"
          class="w100"
          :step="0.01"
        />
      </div>
      <div>
        <sp-field-label>Y</sp-field-label>
        <sp-textfield
          v-model="strip.position.y"
          size="S"
          class="w100"
          type="number"
          :step="0.01"
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
}
</script>

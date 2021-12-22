<template>
  <div class="spectrum-Textfield">
    <select
      data-vega-select
      class="spectrum-Textfield-input"
      style="height: 24px; font-size: 12px"
      :value="value"
      v-bind="$attrs"
      @change="change"
    >
      <option
        v-for="(item, i) in items"
        :key="i"
        :value="item.value"
        :disabled="item.disabled"
        :selected="item.value == value"
      >
        {{ item.text }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

export interface OptionKeyValue {
  value: number | string;
  text: string;
  disabled?: boolean;
}

@Component({})
export default class VegaSelect extends Vue {
  @Prop({ default: () => [] })
  items!: OptionKeyValue[];

  @Prop({ default: "" })
  value!: string;

  change(e: InputEvent) {
    const target = e.target as HTMLInputElement;
    const item = this.items.find((item) => item.value == target.value);
    this.changeEmit(item || null);
  }

  changeEmit(item: OptionKeyValue | null) {
    this.$emit("change", item);
  }
}
</script>
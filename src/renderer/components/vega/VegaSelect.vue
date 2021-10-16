<template>
  <select data-vega-select class="vega-select" :value="value" @change="change">
    <option v-for="(item, i) in items" :key="i" :value="item.value">
      {{ item.text }}
    </option>
  </select>
</template>

<style scoped>
.vega-select {
  border-radius: 0;
  background-color: none;
  border: 1px solid var(--vc);
  box-sizing: border-box;
  width: 100%;
  font-family: Ricty;
  color: white;
  padding: 0 4px;
}

.vega-select:focus {
  outline: none;
  box-sizing: border-box;
  border: 1px solid var(--vc-l-5);
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

export interface OptionKeyValue {
  value: number | string;
  text: string;
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
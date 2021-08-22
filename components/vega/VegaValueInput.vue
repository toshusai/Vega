<template>
  <vega-input :type="type" :value="value" @change="change" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class VegaValueInput extends Vue {
  @Prop({ default: "" })
  value!: number | string;

  @Prop({ default: "text" })
  type!: string;

  change(e: InputEvent) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    if (this.type == "number") {
      const num = Number.parseFloat(value);
      if (isNaN(num)) return;
      this.$emit("change", num);
    } else {
      this.$emit("change", value);
    }
  }
}
</script>
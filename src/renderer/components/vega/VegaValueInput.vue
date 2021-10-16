<template>
  <VegaInput
    data-cy="vega-value-input"
    :type="type"
    :value="value"
    @change="change"
  ></VegaInput>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import VegaInput from "~/components/vega/VegaInput.vue";

@Component({
  components: { VegaInput },
})
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
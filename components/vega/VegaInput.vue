<template>
  <span>
    <input
      data-cy="vega-input"
      class="vega-input"
      :type="type"
      :step="step"
      :value="value"
      @change="(e) => $emit('change', e)"
    />
  </span>
</template>

<style scoped>
.vega-input {
  color: white;
  border-radius: 0;
  background-color: none;
  border: 1px solid var(--vc);
  box-sizing: border-box;
  width: 100%;
  font-family: Ricty;
  padding: 0 4px;
}

.vega-input:focus {
  outline: none;
  box-sizing: border-box;
  border: 1px solid var(--vc-l-5);
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class VegaInput extends Vue {
  @Prop({ default: "" })
  value!: number;

  @Prop({ default: "text" })
  type!: string;

  @Prop({ default: 1 })
  step!: number;
}
</script>
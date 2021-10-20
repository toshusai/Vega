<template>
  <button type="button" :class="cssClass" @click="(e) => $emit('click', e)">
    <span class="spectrum-Button-label">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.vega-button {
  border-radius: 0;
  background-color: none;
  box-sizing: border-box;
  padding: 4px 8px;
  font-family: Ricty;
  cursor: pointer;
  color: white;
  background: var(--vc-d-3);
}

.vega-button:hover {
  outline: none;
  box-sizing: border-box;
  background-color: var(--vc-d-2);
}

.vega-button:focus {
  outline: none;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class TimelineLayer extends Vue {
  @Prop({ default: false })
  primary!: boolean;

  @Prop({ default: false })
  quiet!: boolean;

  get cssClass() {
    return [
      "spectrum-Button",
      "spectrum-Button--" + (this.primary ? "primary" : "cta"),
      this.quiet ? "spectrum-Button--quiet" : "",
      "spectrum-Button--sizeS",
    ];
  }
}
</script>
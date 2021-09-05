<template>
  <VegaButton @click="clickInput">
    <slot />
    <input ref="input" type="file" style="display: none" @change="change" />
  </VegaButton>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref } from "vue-property-decorator";
import { VegaError } from "~/plugins/error";

@Component({})
export default class VegaFileButton extends Vue {
  @Ref() input!: HTMLInputElement;

  @Prop({ default: false }) multiple!: boolean;

  clickInput() {
    this.input.click();
  }

  change(e: MouseEvent) {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    if (this.multiple) {
      this.$emit("change", target.files);
    } else {
      if (target.files.length > 1)
        throw new VegaError("Not support multiple files.");
      const file = target.files[0];
      this.$emit("change", file);
    }
  }
}
</script>
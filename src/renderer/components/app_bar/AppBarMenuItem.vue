<template>
  <button
    class="
      spectrum-Button
      spectrum-Button--primary
      spectrum-Button--quiet
      spectrum-Button--sizeS
    "
    @click="click"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Emit } from "vue-property-decorator";

@Component({})
export default class AppBarMenuItem extends Vue {
  @Emit("click")
  click(e: MouseEvent) {
    return e;
  }
}
</script>
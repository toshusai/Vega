<template>
  <button class="app-bar-menu-button" @click="click">
    <slot />
  </button>
</template>

<style scoped>
.app-bar-menu-button {
  padding: 1px 4px;
  border-radius: none;
  font-size: 14px;
  display: block;
  text-align: left;
  border: none;
  font-family: Ricty;
  background-color: var(--vc-d-3);
  color: white;
}

.app-bar-menu-button:hover {
  cursor: pointer;
  background-color: var(--vc-d-2);
}

.app-bar-menu-button:focus {
  outline: none;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Emit } from "vue-property-decorator";

@Component({})
export default class AppBarMenuButton extends Vue {
  @Emit("click")
  click(e: MouseEvent) {
    return e;
  }
}
</script>
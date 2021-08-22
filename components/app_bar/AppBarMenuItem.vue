<template>
  <button class="app-bar-menu-item" @click="click">
    <slot />
  </button>
</template>

<style scoped>
.app-bar-menu-item {
  padding: 1px 8px;
  border-radius: none;
  font-size: 14px;
  text-align: left;
  display: block;
  border: none;
  font-family: Ricty;
  background-color: var(--vc-d-3);
  color: white;
}

.app-bar-menu-item:hover {
  cursor: pointer;
  background-color: var(--vc-d-2);
}

.app-bar-menu-item:focus {
  outline: none;
}
</style>

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
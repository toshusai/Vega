<template>
  <button class="menu-btn" @click="(e) => $emit('click', e)">
    <slot />
  </button>
</template>

<style scoped>
.menu-btn {
  background-color: var(--vc-d-4);
  padding: 4px 8px;
  border-radius: none;
  font-size: 14px;
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  font-family: Ricty;
  box-shadow: 1px 1px 4px var(--black);
}

.menu-btn:hover {
  cursor: pointer;
  background-color: var(--vc-d-3);
}

.menu-btn:focus {
  outline: none;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class MenuButton extends Vue {}
</script>

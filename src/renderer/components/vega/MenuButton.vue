<template>
  <button
    class="
      spectrum-Button
      spectrum-Button--primary
      spectrum-Button--quiet
      spectrum-Button--sizeS
    "
    style="display: block"
    @click="(e) => $emit('click', e)"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class MenuButton extends Vue {}
</script>

<template>
  <div v-show="isOpen" ref="modal" class="modal">
    <slot />
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0 0 0 / 0.5);
  display: flex;
  z-index: 10;
}
</style>
<script lang="ts">
import Vue from "vue";
import { Component, Ref } from "vue-property-decorator";

@Component({})
export default class Modal extends Vue {
  @Ref() modal?: HTMLElement;

  isOpen: boolean = false;

  mounted() {
    if (this.modal) document.body.append(this.modal);
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}
</script>
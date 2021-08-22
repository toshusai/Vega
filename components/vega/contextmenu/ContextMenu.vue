<template>
  <div v-if="isOpen" ref="el" class="contextmenu" :style="style">
    <slot />
  </div>
</template>

<style scoped>
.contextmenu {
  position: fixed;
  z-index: 10;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class ContextMenu extends Vue {
  x: number = 0;
  y: number = 0;
  isOpen: boolean = false;

  get style(): Partial<CSSStyleDeclaration> {
    return {
      left: this.x + "px",
      top: this.y + "px",
    };
  }

  close() {
    this.isOpen = false;
    window.removeEventListener("mousedown", this.mouseDownInWindow);
  }

  mouseDownInWindow(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const el = this.$refs.el as HTMLElement;
    if (el.contains(target)) {
      return;
    }
    this.close();
  }

  open(e: MouseEvent) {
    window.addEventListener("mousedown", this.mouseDownInWindow);
    this.isOpen = true;
    this.x = e.pageX;
    this.y = e.pageY;
  }
}
</script>

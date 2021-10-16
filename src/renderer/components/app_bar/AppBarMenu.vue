<template>
  <div v-if="isOpen" ref="el" class="app-bar-menu" :style="style">
    <slot />
  </div>
</template>

<style scoped>
.app-bar-menu {
  position: fixed;
  padding: 1px 4px;
  border-radius: none;
  font-size: 14px;
  display: block;
  text-align: left;
  border: none;
  font-family: Ricty;
  background-color: var(--vc-d-3);
  color: white;
  border: 1px solid var(--black);
}

.app-bar-menu:hover {
  background-color: var(--vc-d-2);
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class AppBarMenu extends Vue {
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
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.x = rect.left;
    this.y = rect.bottom;
  }
}
</script>
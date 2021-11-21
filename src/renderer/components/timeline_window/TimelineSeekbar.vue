<template>
  <div class="root" :style="style">
    <div class="seekbar" />
    <div class="seekbar2" />
    <div class="line"></div>
  </div>
</template>

<style scoped>
.root {
  pointer-events: none;
  position: absolute;
}
.seekbar {
  pointer-events: none;
  position: absolute;
  width: 10px;
  height: 10px;
  left: -4px;
  background: var(--sp-blue-400);
  z-index: 2;
}
.seekbar2 {
  pointer-events: none;
  transform-origin: center;
  left: 0;
  top: 0;
  transform: translate(-2.7px, 6px) rotate(45deg);
  position: absolute;
  width: 7px;
  height: 7px;
  background: var(--sp-blue-400);
  z-index: 2;
}

.line {
  position: absolute;
  height: 1000px;
  width: 2px;
  background: var(--sp-blue-400);
  z-index: 2;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class TimelineSeekbar extends Vue {
  @Prop({ default: 0 })
  pos!: number;

  @Prop({ default: 10 })
  scale!: number;

  @Prop({ default: 0 })
  offset!: number;

  get style(): Partial<CSSStyleDeclaration> {
    return {
      left: this.pos * this.scale + this.offset + "px",
    };
  }
}
</script>

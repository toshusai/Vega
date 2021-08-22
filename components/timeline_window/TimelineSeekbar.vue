<template>
  <div class="seekbar" :style="style">
    <div class="line"></div>
  </div>
</template>

<style scoped>
.seekbar {
  pointer-events: none;
  position: absolute;
  width: 10px;
  height: 10px;
  background: red;
  z-index: 2;
}

.line {
  height: 140px;
  width: 1px;
  background: red;
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

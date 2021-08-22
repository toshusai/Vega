<template>
  <div class="offset" :style="offsetStyle" />
</template>

<style scoped>
.offset {
  background-color: rgba(0 0 0 / 0.5);
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  pointer-events: none;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class TimelineOutArea extends Vue {
  @Prop({ default: 0 })
  offset!: number;

  @Prop({ default: 10 })
  scale!: number;

  get offsetStyle(): Partial<CSSStyleDeclaration> {
    return {
      width: this.scale * this.offset + "px",
    };
  }
}
</script>

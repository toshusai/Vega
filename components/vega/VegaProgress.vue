<template>
  <div class="progress">
    <div class="progress-inner" :style="style"></div>
    <div class="progress-text">{{ rateInt }}%</div>
  </div>
</template>

<style scoped>
.progress {
  background-color: var(--vc-d-3);
  display: flex;
  height: 20px;
  position: relative;
}

.progress-inner {
  background-color: var(--vc-d-2);
  height: 100%;
  position: absolute;
}

.progress-text {
  color: white;
  margin: auto;
  z-index: 1;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class VagaProgress extends Vue {
  // 0 to 1
  @Prop({ default: 0 }) rate!: number;

  get rateInt() {
    return Math.round(this.rate * 100);
  }

  get style(): Partial<CSSStyleDeclaration> {
    return {
      width: this.rateInt + "%",
    };
  }
}
</script>
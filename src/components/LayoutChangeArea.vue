<script setup lang="ts">
interface Emits {
  (e: 'top', event: MouseEvent): void;
  (e: 'left', event: MouseEvent): void;
  (e: 'right', event: MouseEvent): void;
  (e: 'bottom', event: MouseEvent): void;
}

const emit = defineEmits<Emits>()

const top = (event: MouseEvent) => {
  emit('top', event)
}

const left = (event: MouseEvent) => {
  emit('left', event)
}

const right = (event: MouseEvent) => {
  emit('right', event)
}

const bottom = (event: MouseEvent) => {
  emit('bottom', event)
}
</script>

<template>
  <div class="layout-change-area">
    <div class="top">
      <svg
        style="left: -32px; width: 32px; height: 32px; position: absolute"
        viewBox="0 0 32 32"
        fill="var(--area-color)"
        @mouseup="top"
      >
        <path d="M0 0 L32 0 L32 32 Z" />
      </svg>
      <svg
        style="right: -32px; width: 32px; height: 32px; position: absolute"
        viewBox="0 0 32 32"
        fill="var(--area-color)"
        @mouseup="top"
      >
        <path d="M0 0 L32 0 L0 32 Z" />
      </svg>
    </div>
    <!-- <div class="left" @mouseup="left"></div>
    <div class="right" @mouseup="right"></div>
    <div class="bottom" @mouseup="bottom"></div> -->
  </div>
</template>

<style scoped>
:root {
}
.layout-change-area {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.top {
  --area-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 32px;
  width: calc(100% - 64px);
  height: 32px;
  background-color: var(--area-color);
}

.right {
  position: absolute;
  top: 32px;
  right: 0;
  width: 32px;
  height: calc(100% - 64px);
  background-color: gray;
}

.bottom {
  position: absolute;
  bottom: 0;
  left: 32px;
  width: calc(100% - 64px);
  height: 32px;
  background-color: gray;
}

.left {
  position: absolute;
  top: 32px;
  left: 0;
  width: 32px;
  height: calc(100% - 64px);
  background-color: gray;
}
</style>

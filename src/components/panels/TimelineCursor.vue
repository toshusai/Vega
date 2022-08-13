<script setup lang="ts">
const { timeline } = useTimeline()
</script>

<template>
  <div
    v-bind="$attrs"
    ref="el"
    class="cursor"
  >
    <svg fill="red">
      <path d="M-8 0 L0 8 L8 0 Z" />
    </svg>
  </div>
</template>

<style scoped>
.cursor {
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 1px;
  height: 100%;
  background: red;
  z-index: 2;
}
</style>

<script setup lang="ts">
defineProps({
  size: {
    type: Number,
    default: 24
  },
  path: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <svg :width="size" :viewBox="`0 0 ${size} ${size}`" :height="size" v-bind="$attrs">
    <path :d="path" />
  </svg>
</template>

<style scoped></style>

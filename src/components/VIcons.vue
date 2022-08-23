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
  <svg :width="size" :height="size" :viewBox="`0 0 24 24`" v-bind="$attrs">
    <path :d="path" />
  </svg>
</template>

<style scoped></style>

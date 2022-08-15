<script setup lang="ts">
import '~/assets/css/main.css'

const isOpen = ref(false)
</script>

<template>
  <button @click="() => (isOpen = true)">
    settings
  </button>
  <settings-modal :is-open="isOpen" @close="() => (isOpen = false)" />
</template>

<style scoped></style>

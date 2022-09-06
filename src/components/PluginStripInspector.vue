<script setup lang="ts">
import { StripEffect } from '@/core'

const props = defineProps<{ effect: StripEffect & { name: string } }>()
</script>

<template>
  <div class="p-4">
    <div>{{ props.effect.name }}</div>
  </div>
</template>

<style scoped>
</style>

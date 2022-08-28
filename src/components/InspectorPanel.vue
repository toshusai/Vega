<script setup lang="ts">
import { Strip } from '@//core/Strip'
const { timeline } = useTimeline()

const strip = computed(() => {
  return timeline.value.selectedStrips[0] as Strip | null
})

const effect = computed(() => {
  return strip.value?.effects.find(_ => true)
})

const componentName = computed(() => {
  return `${effect.value?.type.toLowerCase()}-strip-inspector`
})

</script>

<template>
  <div v-if="strip" style="height: 100%; overflow-y: scroll; padding-right: 16px;">
    <component :is="componentName" :strip="strip" />
  </div>
</template>

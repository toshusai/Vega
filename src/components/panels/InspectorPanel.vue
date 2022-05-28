<script setup lang="ts">
import { ComputedRef } from 'vue'
import { isText, isVideo } from '../../composables/useTimeline'
import TextStripInspector from '../TextStripInspector.vue'
import { Strip } from '~~/src/core/Strip'
import { TextStripEffect } from '~~/src/core/TextStripEffect'
import { getEffect } from '~~/src/utils/getEffect'
const { timeline, updateEffect } = useTimeline()

const strip = computed(() => {
  return timeline.value.selectedStrips[0] as Strip | null
})

const effect = computed(() => {
  return strip.value?.effects.find(_ => true)
})

const componentName = computed(() => {
  return `${effect.value?.type}StripInspector`
})

</script>

<template>
  <div v-if="strip" style="height: 100%; overflow-y: scroll; padding-right: 16px;">
    <component :is="componentName" :strip="strip" />
  </div>
</template>

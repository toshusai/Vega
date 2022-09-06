<script setup lang="ts">
import { PluginEffectObject, Renderer, StripEffect } from '@/core'

const props = defineProps<{ effect: StripEffect }>()

const el = ref<HTMLElement | null>(null)
onMounted(() => {
  const effect = Renderer.effectObjectMap.get(props.effect.id) as PluginEffectObject | undefined
  effect?.onMounted(el.value, props.effect)
})
onUnmounted(() => {
  const effect = Renderer.effectObjectMap.get(props.effect.id) as PluginEffectObject | undefined
  effect?.onUnMounted(el.value, props.effect)
})
</script>

<template>
  <div class="p-4">
    <div ref="el" />
    <div />
  </div>
</template>

<style scoped>
</style>

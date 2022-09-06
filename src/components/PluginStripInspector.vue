<script setup lang="ts">
import { PluginEffectObject, Renderer, StripEffect } from '@/core'

const props = defineProps<{ effect: StripEffect }>()

const el = ref<HTMLElement | null>(null)
onMounted(() => {
  if (!el.value) { return }
  const effect = Renderer.effectObjectMap.get(props.effect.id) as PluginEffectObject | undefined
  effect?.mounted(el.value, props.effect)
})
onUnmounted(() => {
  if (!el.value) { return }
  const effect = Renderer.effectObjectMap.get(props.effect.id) as PluginEffectObject | undefined
  effect?.unMounted(el.value, props.effect)
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

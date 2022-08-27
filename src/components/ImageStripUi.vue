<script setup lang="ts">
import { mdiRhombus } from '@mdi/js'
import { ImageStripEffect } from '@//core/ImageStripEffect'
import { ImageStripEffectObject } from '@//core/ImageStripEffectObject'
import { Strip } from '@//core/Strip'

const props = defineProps<{ strip: Strip }>()
const { timeline } = useTimeline()
const { assets } = useAssets()

const imageEffect = computed(() => {
  return props.strip.effects.find(e => e.type === 'Image') as ImageStripEffect
})

const el = ref<HTMLElement | null>(null)

const pixScale = computed(() => usePixPerSecTimeline(el.value?.parentElement?.parentElement))

const effectObj = computed(() => {
  const effectObj = effectObjectMap.get(
    imageEffect.value.id
  ) as ImageStripEffectObject | null
  return effectObj
})

const overLeft = computed(() => {
  return (props.strip.start - timeline.value.start) * pixScale.value
})

const markerSize = 12

const imageSrc = computed(() => {
  return assets.value.assets.find(a => a.id === imageEffect.value.imageAssetId)?.path
})

</script>

<template>
  <div
    v-if="imageEffect"
    ref="el"
    style="
      height: 100%;
      display: flex;
      overflow: hidden;
      padding: 0 12px;
      position: relative;
    "
  >
    <div style="overflow: hidden">
      <img v-if="effectObj" style="height: 100%;" :src="imageSrc">
    </div>
    <div>
      <v-icons
        v-for="(anim, i) in imageEffect.animations"
        :key="i"
        :path="mdiRhombus"
        style="
          fill: orange;
          stroke: white;
          stroke-width: 2px;
          position: absolute;
        "
        :style="`width: ${markerSize}px; height: ${markerSize}px; left: ${anim.time * pixScale -
          4 -
          markerSize / 2 +
          (overLeft < -50 ? overLeft + 50 : 0) // 4(strip border) + 6(half width)
        }px; z-index: 1; bottom: ${0}px`"
        viewBox="0 0 24 24"
      />
    </div>
  </div>
</template>
